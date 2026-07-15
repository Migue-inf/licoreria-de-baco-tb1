from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(200))
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    pedidos: Mapped[list["Pedido"]] = relationship("Pedido", back_populates="usuario")
    carrito_items: Mapped[list["CarritoItem"]] = relationship(
        "CarritoItem", back_populates="usuario", cascade="all, delete-orphan"
    )


class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(150))
    categoria: Mapped[str] = mapped_column(String(80), index=True)
    descripcion: Mapped[str] = mapped_column(Text)
    precio: Mapped[float] = mapped_column(Float)
    imagen: Mapped[str | None] = mapped_column(String(300), nullable=True)
    icono: Mapped[str | None] = mapped_column(String(10), nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)


class CarritoItem(Base):
    __tablename__ = "carrito_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuarios.id"), nullable=False)
    producto_id: Mapped[int] = mapped_column(Integer, ForeignKey("productos.id"), nullable=False)
    nombre: Mapped[str] = mapped_column(String(150))
    categoria: Mapped[str] = mapped_column(String(80))
    precio: Mapped[float] = mapped_column(Float)
    cantidad: Mapped[int] = mapped_column(Integer, default=1)
    icono: Mapped[str | None] = mapped_column(String(10), nullable=True)
    imagen: Mapped[str | None] = mapped_column(String(300), nullable=True)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="carrito_items")


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    usuario_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("usuarios.id"), nullable=True
    )
    nombre_cliente: Mapped[str | None] = mapped_column(String(150), nullable=True)
    telefono: Mapped[str | None] = mapped_column(String(30), nullable=True)
    direccion: Mapped[str | None] = mapped_column(String(300), nullable=True)
    zona_delivery: Mapped[str | None] = mapped_column(String(80), nullable=True)
    costo_delivery: Mapped[float] = mapped_column(Float, default=0.0)
    subtotal: Mapped[float] = mapped_column(Float)
    total: Mapped[float] = mapped_column(Float)
    estado: Mapped[str] = mapped_column(String(30), default="pendiente")
    notas: Mapped[str | None] = mapped_column(Text, nullable=True)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    usuario: Mapped["Usuario | None"] = relationship("Usuario", back_populates="pedidos")
    items: Mapped[list["ItemPedido"]] = relationship(
        "ItemPedido", back_populates="pedido", cascade="all, delete-orphan"
    )


class ItemPedido(Base):
    __tablename__ = "items_pedido"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pedido_id: Mapped[int] = mapped_column(Integer, ForeignKey("pedidos.id"))
    producto_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("productos.id"), nullable=True
    )
    nombre: Mapped[str] = mapped_column(String(150))
    precio_unitario: Mapped[float] = mapped_column(Float)
    cantidad: Mapped[int] = mapped_column(Integer)
    subtotal: Mapped[float] = mapped_column(Float)

    pedido: Mapped["Pedido"] = relationship("Pedido", back_populates="items")


class Promocion(Base):
    __tablename__ = "promociones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(150))
    descripcion: Mapped[str] = mapped_column(Text)
    precio_texto: Mapped[str] = mapped_column(String(80))
    badge: Mapped[str] = mapped_column(String(50))
    activo: Mapped[bool] = mapped_column(Boolean, default=True)


class ZonaDelivery(Base):
    __tablename__ = "zonas_delivery"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100))
    distritos: Mapped[str] = mapped_column(Text)
    costo_min: Mapped[float] = mapped_column(Float)
    costo_max: Mapped[float] = mapped_column(Float)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)