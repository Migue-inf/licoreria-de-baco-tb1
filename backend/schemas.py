from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


# ── Auth ──────────────────────────────────────────────────────────────────────

from datetime import date

class UsuarioRegistro(BaseModel):
    nombre: str
    email: EmailStr
    contrasena: str
    fecha_nacimiento: date | None = None

    @field_validator("contrasena")
    @classmethod
    def contrasena_minima(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres")
        return v

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip()

    @field_validator("fecha_nacimiento")
    @classmethod
    def mayor_de_edad(cls, v: date | None) -> date | None:
        if v is None:
            return v
        hoy = date.today()
        edad = hoy.year - v.year - ((hoy.month, hoy.day) < (v.month, v.day))
        if edad < 18:
            raise ValueError("Debes ser mayor de 18 años para registrarte")
        return v


class UsuarioLogin(BaseModel):
    email: EmailStr
    contrasena: str


class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    email: str
    activo: bool
    fecha_nacimiento: date | None = None
    creado_en: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioRespuesta


# ── Productos ──────────────────────────────────────────────────────────────────

class ProductoRespuesta(BaseModel):
    id: int
    nombre: str
    categoria: str
    descripcion: str
    precio: float
    imagen: str | None
    icono: str | None
    activo: bool

    model_config = {"from_attributes": True}


class ProductosPaginados(BaseModel):
    items: list[ProductoRespuesta]
    total: int
    pagina: int
    total_paginas: int
    categoria: str


# ── Pedidos ───────────────────────────────────────────────────────────────────

class ItemPedidoEntrada(BaseModel):
    nombre: str
    precio_unitario: float
    cantidad: int
    producto_id: int | None = None

    @field_validator("cantidad")
    @classmethod
    def cantidad_positiva(cls, v: int) -> int:
        if v < 1:
            raise ValueError("La cantidad debe ser al menos 1")
        return v

    @field_validator("precio_unitario")
    @classmethod
    def precio_positivo(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        return v


class PedidoEntrada(BaseModel):
    items: list[ItemPedidoEntrada]
    nombre_cliente: str | None = None
    telefono: str | None = None
    direccion: str | None = None
    zona_delivery: str | None = None
    notas: str | None = None

    @field_validator("items")
    @classmethod
    def items_no_vacios(cls, v: list) -> list:
        if not v:
            raise ValueError("El pedido debe tener al menos un producto")
        return v


class ItemPedidoRespuesta(BaseModel):
    id: int
    nombre: str
    precio_unitario: float
    cantidad: int
    subtotal: float
    producto_id: int | None

    model_config = {"from_attributes": True}


class PedidoRespuesta(BaseModel):
    id: int
    usuario_id: int | None
    nombre_cliente: str | None
    telefono: str | None
    direccion: str | None
    zona_delivery: str | None
    costo_delivery: float
    subtotal: float
    total: float
    estado: str
    notas: str | None
    creado_en: datetime
    items: list[ItemPedidoRespuesta]

    model_config = {"from_attributes": True}


# ── Promociones ───────────────────────────────────────────────────────────────

class PromocionRespuesta(BaseModel):
    id: int
    titulo: str
    descripcion: str
    precio_texto: str
    badge: str
    activo: bool

    model_config = {"from_attributes": True}


# ── Carrito ──────────────────────────────────────────────────────────────────

class CarritoItemEntrada(BaseModel):
    producto_id: int
    nombre: str
    categoria: str
    precio: float
    cantidad: int = 1
    icono: str | None = None
    imagen: str | None = None


class CarritoItemRespuesta(BaseModel):
    id: int
    producto_id: int
    nombre: str
    categoria: str
    precio: float
    cantidad: int
    icono: str | None = None
    imagen: str | None = None

    model_config = {"from_attributes": True}


class CarritoActualizarCantidad(BaseModel):
    cantidad: int


# ── Delivery ──────────────────────────────────────────────────────────────────

class ZonaDeliveryRespuesta(BaseModel):
    id: int
    nombre: str
    distritos: list[str]
    costo_min: float
    costo_max: float

    model_config = {"from_attributes": True}


class CostoDeliveryRespuesta(BaseModel):
    zona: str
    costo: float
    gratis: bool
    mensaje: str
