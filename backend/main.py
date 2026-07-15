from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from routers import auth, carrito, delivery, orders, products, promotions
from seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed()
    yield


app = FastAPI(
    title="Licorería de Baco — API",
    description="Backend para la tienda online de la Licorería de Baco",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:4000",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:4000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(carrito.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(delivery.router)
app.include_router(promotions.router)


@app.get("/", tags=["Estado"])
def raiz():
    return {
        "mensaje": "Licorería de Baco — API activa",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Estado"])
def health():
    return {"status": "ok"}
