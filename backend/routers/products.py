from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models import Producto
from schemas import ProductoRespuesta, ProductosPaginados

router = APIRouter(prefix="/api/productos", tags=["Productos"])


def _normalizar_imagen(imagen: str | None) -> str | None:
    if not imagen:
        return None

    imagen_normalizada = imagen.strip()
    if imagen_normalizada.startswith("http"):
        return imagen_normalizada
    if not imagen_normalizada.startswith('/'):
        imagen_normalizada = f"/{imagen_normalizada}"

    return imagen_normalizada.replace(
        '/assets/img/Ron_Flor_de_Caña_5_años.jpg',
        '/assets/img/Ron_Flor_de_Cana_5_anios.jpg',
    )


def _producto_respuesta(producto: Producto) -> ProductoRespuesta:
    respuesta = ProductoRespuesta.model_validate(producto)
    return respuesta.model_copy(update={"imagen": _normalizar_imagen(respuesta.imagen)})


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    categoria: str = Query("Todas", description="Filtrar por categoría"),
    pagina: int = Query(1, ge=1, description="Número de página"),
    limite: int = Query(50, ge=1, le=50, description="Productos por página"),
    db: Session = Depends(get_db),
):
    query = db.query(Producto).filter(Producto.activo == True)

    if categoria and categoria != "Todas":
        query = query.filter(Producto.categoria == categoria)

    total = query.count()
    total_paginas = max(1, -(-total // limite))  # ceil division

    if pagina > total_paginas and total > 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La página {pagina} no existe. Total de páginas: {total_paginas}",
        )

    items = query.offset((pagina - 1) * limite).limit(limite).all()

    return ProductosPaginados(
        items=[_producto_respuesta(p) for p in items],
        total=total,
        pagina=pagina,
        total_paginas=total_paginas,
        categoria=categoria,
    )


@router.get("/categorias", response_model=list[str])
def listar_categorias(db: Session = Depends(get_db)):
    rows = (
        db.query(Producto.categoria)
        .filter(Producto.activo == True)
        .distinct()
        .order_by(Producto.categoria)
        .all()
    )
    return ["Todas"] + [r[0] for r in rows]


@router.get("/buscar", response_model=list[ProductoRespuesta])
def buscar_productos(
    q: str = Query(..., min_length=1, description="Término de búsqueda"),
    db: Session = Depends(get_db),
):
    termino = f"%{q.lower()}%"
    productos = (
        db.query(Producto)
        .filter(
            Producto.activo == True,
            (Producto.nombre.ilike(termino)) | (Producto.categoria.ilike(termino)),
        )
        .all()
    )
    return [_producto_respuesta(p) for p in productos]


@router.get("/{producto_id}", response_model=ProductoRespuesta)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, producto_id)
    if not producto or not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )
    return _producto_respuesta(producto)
