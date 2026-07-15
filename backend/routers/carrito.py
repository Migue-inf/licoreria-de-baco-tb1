from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import CarritoItem, Usuario
from schemas import CarritoActualizarCantidad, CarritoItemEntrada, CarritoItemRespuesta

router = APIRouter(prefix="/api/carrito", tags=["Carrito"])


@router.get("", response_model=list[CarritoItemRespuesta])
def listar_carrito(
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(CarritoItem)
        .filter(CarritoItem.usuario_id == usuario.id)
        .all()
    )
    return items


@router.post("", response_model=CarritoItemRespuesta, status_code=status.HTTP_201_CREATED)
def agregar_al_carrito(
    datos: CarritoItemEntrada,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verificar si el producto ya está en el carrito
    existente = (
        db.query(CarritoItem)
        .filter(
            CarritoItem.usuario_id == usuario.id,
            CarritoItem.producto_id == datos.producto_id,
        )
        .first()
    )

    if existente:
        # Incrementar cantidad
        existente.cantidad += datos.cantidad
        db.commit()
        db.refresh(existente)
        return existente

    # Crear nuevo item
    item = CarritoItem(
        usuario_id=usuario.id,
        producto_id=datos.producto_id,
        nombre=datos.nombre,
        categoria=datos.categoria,
        precio=datos.precio,
        cantidad=datos.cantidad,
        icono=datos.icono,
        imagen=datos.imagen,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=CarritoItemRespuesta)
def actualizar_cantidad(
    item_id: int,
    datos: CarritoActualizarCantidad,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CarritoItem)
        .filter(CarritoItem.id == item_id, CarritoItem.usuario_id == usuario.id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item no encontrado en el carrito",
        )

    if datos.cantidad < 1:
        db.delete(item)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Item eliminado por cantidad cero",
        )

    item.cantidad = datos.cantidad
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_del_carrito(
    item_id: int,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CarritoItem)
        .filter(CarritoItem.id == item_id, CarritoItem.usuario_id == usuario.id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item no encontrado en el carrito",
        )

    db.delete(item)
    db.commit()


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def vaciar_carrito(
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(CarritoItem).filter(CarritoItem.usuario_id == usuario.id).delete()
    db.commit()