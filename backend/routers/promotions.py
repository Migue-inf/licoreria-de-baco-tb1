from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Promocion
from schemas import PromocionRespuesta

router = APIRouter(prefix="/api/promociones", tags=["Promociones"])


@router.get("", response_model=list[PromocionRespuesta])
def listar_promociones(db: Session = Depends(get_db)):
    promociones = (
        db.query(Promocion).filter(Promocion.activo == True).all()
    )
    return [PromocionRespuesta.model_validate(p) for p in promociones]
