from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user, get_optional_user
from database import get_db
from models import ItemPedido, Pedido, Usuario, ZonaDelivery
from schemas import PedidoEntrada, PedidoRespuesta

router = APIRouter(prefix="/api/pedidos", tags=["Pedidos"])

MONTO_DELIVERY_GRATIS = 80.0


def _calcular_costo_delivery(zona: str | None, subtotal: float, db: Session) -> float:
    if subtotal >= MONTO_DELIVERY_GRATIS:
        return 0.0
    if not zona:
        return 0.0
    zona_db = (
        db.query(ZonaDelivery)
        .filter(ZonaDelivery.nombre.ilike(f"%{zona}%"), ZonaDelivery.activo == True)
        .first()
    )
    return zona_db.costo_min if zona_db else 0.0


@router.post("", response_model=PedidoRespuesta, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    datos: PedidoEntrada,
    db: Session = Depends(get_db),
    usuario: Usuario | None = Depends(get_optional_user),
):
    subtotal = sum(item.precio_unitario * item.cantidad for item in datos.items)
    costo_delivery = _calcular_costo_delivery(datos.zona_delivery, subtotal, db)
    total = subtotal + costo_delivery

    pedido = Pedido(
        usuario_id=usuario.id if usuario else None,
        nombre_cliente=datos.nombre_cliente,
        telefono=datos.telefono,
        direccion=datos.direccion,
        zona_delivery=datos.zona_delivery,
        costo_delivery=costo_delivery,
        subtotal=subtotal,
        total=total,
        notas=datos.notas,
    )
    db.add(pedido)
    db.flush()

    for item in datos.items:
        db.add(
            ItemPedido(
                pedido_id=pedido.id,
                producto_id=item.producto_id,
                nombre=item.nombre,
                precio_unitario=item.precio_unitario,
                cantidad=item.cantidad,
                subtotal=item.precio_unitario * item.cantidad,
            )
        )

    db.commit()
    db.refresh(pedido)
    return PedidoRespuesta.model_validate(pedido)


@router.get("", response_model=list[PedidoRespuesta])
def listar_pedidos(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    pedidos = (
        db.query(Pedido)
        .filter(Pedido.usuario_id == usuario.id)
        .order_by(Pedido.creado_en.desc())
        .all()
    )
    return [PedidoRespuesta.model_validate(p) for p in pedidos]


@router.get("/{pedido_id}", response_model=PedidoRespuesta)
def obtener_pedido(
    pedido_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    pedido = db.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    if pedido.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin acceso a este pedido")
    return PedidoRespuesta.model_validate(pedido)


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRespuesta)
def cancelar_pedido(
    pedido_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    pedido = db.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    if pedido.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin acceso a este pedido")
    if pedido.estado not in ("pendiente",):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede cancelar un pedido en estado '{pedido.estado}'",
        )
    pedido.estado = "cancelado"
    db.commit()
    db.refresh(pedido)
    return PedidoRespuesta.model_validate(pedido)
