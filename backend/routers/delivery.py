import json

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import ZonaDelivery
from schemas import CostoDeliveryRespuesta, ZonaDeliveryRespuesta

router = APIRouter(prefix="/api/delivery", tags=["Delivery"])

MONTO_DELIVERY_GRATIS = 80.0


def _zona_to_schema(zona: ZonaDelivery) -> ZonaDeliveryRespuesta:
    try:
        distritos = json.loads(zona.distritos)
    except (ValueError, TypeError):
        distritos = [d.strip() for d in zona.distritos.split(",")]
    return ZonaDeliveryRespuesta(
        id=zona.id,
        nombre=zona.nombre,
        distritos=distritos,
        costo_min=zona.costo_min,
        costo_max=zona.costo_max,
    )


@router.get("/zonas", response_model=list[ZonaDeliveryRespuesta])
def listar_zonas(db: Session = Depends(get_db)):
    zonas = db.query(ZonaDelivery).filter(ZonaDelivery.activo == True).all()
    return [_zona_to_schema(z) for z in zonas]


@router.get("/costo", response_model=CostoDeliveryRespuesta)
def calcular_costo(
    zona: str = Query(..., description="Nombre de la zona de delivery"),
    total: float = Query(..., ge=0, description="Total de la compra en soles"),
    db: Session = Depends(get_db),
):
    if total >= MONTO_DELIVERY_GRATIS:
        return CostoDeliveryRespuesta(
            zona=zona,
            costo=0.0,
            gratis=True,
            mensaje=f"¡Delivery gratis! Tu compra supera S/ {MONTO_DELIVERY_GRATIS:.0f}.",
        )

    zona_db = (
        db.query(ZonaDelivery)
        .filter(ZonaDelivery.nombre.ilike(f"%{zona}%"), ZonaDelivery.activo == True)
        .first()
    )

    if not zona_db:
        return CostoDeliveryRespuesta(
            zona=zona,
            costo=0.0,
            gratis=False,
            mensaje="Zona no encontrada. Contáctanos por WhatsApp para confirmar cobertura.",
        )

    return CostoDeliveryRespuesta(
        zona=zona_db.nombre,
        costo=zona_db.costo_min,
        gratis=False,
        mensaje=f"Costo de delivery a {zona_db.nombre}: S/ {zona_db.costo_min:.2f} – S/ {zona_db.costo_max:.2f}.",
    )
