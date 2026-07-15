from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import create_access_token, get_current_user, hash_password, verify_password
from database import get_db
from models import Usuario
from schemas import Token, UsuarioLogin, UsuarioRegistro, UsuarioRespuesta

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


@router.post("/registro", response_model=Token, status_code=status.HTTP_201_CREATED)
def registrar(datos: UsuarioRegistro, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo electrónico",
        )

    usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        hashed_password=hash_password(datos.contrasena),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    token = create_access_token({"sub": str(usuario.id)})
    return Token(
        access_token=token,
        token_type="bearer",
        usuario=UsuarioRespuesta.model_validate(usuario),
    )


@router.post("/login", response_model=Token)
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if not usuario or not verify_password(datos.contrasena, usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta desactivada",
        )

    token = create_access_token({"sub": str(usuario.id)})
    return Token(
        access_token=token,
        token_type="bearer",
        usuario=UsuarioRespuesta.model_validate(usuario),
    )


@router.get("/me", response_model=UsuarioRespuesta)
def obtener_perfil(usuario: Usuario = Depends(get_current_user)):
    return usuario
