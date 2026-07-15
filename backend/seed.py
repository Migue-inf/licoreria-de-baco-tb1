"""Populate the database with initial data."""

import json
from database import SessionLocal, engine
from models import Base, Producto, Promocion, ZonaDelivery

Base.metadata.create_all(bind=engine)

PRODUCTOS = [
    {
        "nombre": "Vino tinto clásico",
        "categoria": "Vinos",
        "descripcion": "Una opción suave para acompañar cenas y reuniones.",
        "precio": 39.90,
        "imagen": "assets/img/Vino_tinto_clasico.jpg",
        "icono": "🍷",
    },
    {
        "nombre": "Vino blanco",
        "categoria": "Vinos",
        "descripcion": "Vino fresco para compartir en almuerzos y celebraciones.",
        "precio": 42.90,
        "imagen": "assets/img/Vino_blanco.jpg",
        "icono": "🍾",
    },
    {
        "nombre": "Cerveza Pilsen 6 pack",
        "categoria": "Cervezas",
        "descripcion": "Pack de seis latas para compartir bien frías.",
        "precio": 21.70,
        "imagen": "assets/img/Cerveza_Pilse_6pck_355ml.jpg",
    },
    {
        "nombre": "Cerveza artesanal",
        "categoria": "Cervezas",
        "descripcion": "Cerveza referencial de sabor intenso y presentación individual.",
        "precio": 12.90,
        "imagen": "assets/img/Cerveza_artesanal.jpg",
        "icono": "🍺",
    },
    {
        "nombre": "Whisky Johnnie Walker Blue Label",
        "categoria": "Whiskies",
        "descripcion": "Whisky premium para celebraciones y ocasiones especiales.",
        "precio": 169.90,
        "imagen": "assets/img/Blue_Label_1Lt.jpg",
    },
    {
        "nombre": "Whisky escocés",
        "categoria": "Whiskies",
        "descripcion": "Botella referencial para brindar en una reunión especial.",
        "precio": 89.90,
        "imagen": "assets/img/Whisky_escoces.jpg",
        "icono": "🥃",
    },
    {
        "nombre": "Ron Flor de Caña 5 años",
        "categoria": "Rones",
        "descripcion": "Ron añejo de sabor equilibrado, botella de 750 ml.",
        "precio": 49.90,
        "imagen": "assets/img/Ron_Flor_de_Cana_5_anios.jpg",
    },
    {
        "nombre": "Ron dorado",
        "categoria": "Rones",
        "descripcion": "Ron referencial para preparar cócteles y mezclas sencillas.",
        "precio": 44.90,
        "imagen": "assets/img/Ron_dorado.jpg",
        "icono": "🥃",
    },
    {
        "nombre": "Vodka Absolut 700ml",
        "categoria": "Vodkas",
        "descripcion": "Vodka clásico para preparar distintos cócteles.",
        "precio": 59.90,
        "imagen": "assets/img/Vodka_Absolute_700ml.jpg",
    },
    {
        "nombre": "Vodka Smirnoff 700ml",
        "categoria": "Vodkas",
        "descripcion": "Botella de 700 ml, ideal para mezclar y compartir.",
        "precio": 39.90,
        "imagen": "assets/img/Vodka_smirnoff_700ml.jpeg",
    },
    {
        "nombre": "Pisco Portón 750ml",
        "categoria": "Pisco",
        "descripcion": "Pisco peruano para chilcanos, sours y brindis.",
        "precio": 85.90,
        "imagen": "assets/img/Pisco_Porton_750ml.jpg",
        "icono": "🍸",
    },
    {
        "nombre": "Pisco quebranta",
        "categoria": "Pisco",
        "descripcion": "Pisco referencial para preparar bebidas peruanas.",
        "precio": 55.90,
        "imagen": "assets/img/Pisco_quebranta.jpg",
        "icono": "🍸",
    },
    {
        "nombre": "Licor de crema",
        "categoria": "Otros licores",
        "descripcion": "Licor dulce y suave para servir frío o acompañar postres.",
        "precio": 45.90,
        "imagen": "assets/img/Licor_de_crema.jpg",
        "icono": "🥃",
    },
    {
        "nombre": "Tequila clásico",
        "categoria": "Otros licores",
        "descripcion": "Botella referencial para reuniones y celebraciones.",
        "precio": 69.90,
        "imagen": "assets/img/Tequila_clasico.jpg",
        "icono": "🍸",
    },
    {
        "nombre": "Licor de anís",
        "categoria": "Otros licores",
        "descripcion": "Licor tradicional de sabor dulce y aroma característico.",
        "precio": 35.90,
        "imagen": "assets/img/Licor_de_anis.jpg",
        "icono": "🥂",
    },
    {
        "nombre": "Cigarro Lucky Strike Fresh Twist",
        "categoria": "Cigarros",
        "descripcion": "Caja de 20 unidades con filtro de menta fresh twist.",
        "precio": 18.50,
        "imagen": "assets/img/Cigarro_lucky_strike_fresh_tiwst_caja_20und.jpeg",
    },
    {
        "nombre": "Cigarro Marlboro Full Flavor",
        "categoria": "Cigarros",
        "descripcion": "Caja de 20 unidades, sabor clásico y fuerte.",
        "precio": 19.90,
        "imagen": "assets/img/Cigarro_marlboro_full_flavor_caja_20und.jpeg",
    },
    {
        "nombre": "Cigarro Pall Mall XL Blue",
        "categoria": "Cigarros",
        "descripcion": "Caja de 20 unidades, tamaño XL, suave y equilibrado.",
        "precio": 17.90,
        "imagen": "assets/img/Cigarro_pall_mall_xl_blue_caja_20und.jpeg",
    },
    {
        "nombre": "Gaseosa Coca Cola 3L",
        "categoria": "Gaseosas",
        "descripcion": "Botella de 3 litros, el clásico refresco para compartir.",
        "precio": 15.50,
        "imagen": "assets/img/Gaseosa_coca_cola_botella_3L.jpeg",
    },
    {
        "nombre": "Gaseosa Ginger Ale Schweppes 1.5L",
        "categoria": "Gaseosas",
        "descripcion": "Botella de 1.5 litros, ideal para preparar chilcanos.",
        "precio": 8.90,
        "imagen": "assets/img/Gaseosa_ginger_ale_scheweppes_botella_1_5L.jpeg",
    },
    {
        "nombre": "Gaseosa Inca Kola sabor original 3L",
        "categoria": "Gaseosas",
        "descripcion": "Botella de 3 litros, el sabor peruano original.",
        "precio": 14.50,
        "imagen": "assets/img/Gaseosa_inca_kola_sabor_original_botella_3L.jpeg",
    },
]

PROMOCIONES = [
    {
        "titulo": "Noche de cervezas",
        "descripcion": "Dos packs seleccionados por un precio especial para compartir con amigos.",
        "precio_texto": "Desde S/ 39.90",
        "badge": "Oferta",
    },
    {
        "titulo": "Combo para chilcano",
        "descripcion": "Pisco seleccionado más ginger ale para preparar una mezcla sencilla en casa.",
        "precio_texto": "Promoción referencial",
        "badge": "10% menos",
    },
    {
        "titulo": "Ron para compartir",
        "descripcion": "Precio especial en botellas seleccionadas de ron durante el fin de semana.",
        "precio_texto": "Consulta disponibilidad",
        "badge": "Fin de semana",
    },
    {
        "titulo": "Pack de vinos",
        "descripcion": "Dos vinos seleccionados — uno tinto y uno blanco — para cenas especiales.",
        "precio_texto": "Desde S/ 75.00",
        "badge": "Combo",
    },
    {
        "titulo": "Delivery gratis desde S/ 80",
        "descripcion": "Delivery sin costo en pedidos superiores a S/ 80 dentro de la zona de cobertura.",
        "precio_texto": "Válido en Lima Sur",
        "badge": "Delivery gratis",
    },
    {
        "titulo": "Vodka de temporada",
        "descripcion": "Botella seleccionada a precio de introducción. Ideal para cócteles.",
        "precio_texto": "Consulta precio",
        "badge": "Nuevo",
    },
]

ZONAS_DELIVERY = [
    {
        "nombre": "Zona cercana",
        "distritos": ["Santiago de Surco", "San Borja", "Miraflores"],
        "costo_min": 5.0,
        "costo_max": 8.0,
    },
    {
        "nombre": "Zona media",
        "distritos": ["Barranco", "Chorrillos", "La Molina"],
        "costo_min": 8.0,
        "costo_max": 12.0,
    },
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Producto).count() == 0:
            for data in PRODUCTOS:
                db.add(Producto(**data))
            print(f"  OK {len(PRODUCTOS)} productos insertados")

        if db.query(Promocion).count() == 0:
            for data in PROMOCIONES:
                db.add(Promocion(**data))
            print(f"  OK {len(PROMOCIONES)} promociones insertadas")

        if db.query(ZonaDelivery).count() == 0:
            for data in ZONAS_DELIVERY:
                distritos = json.dumps(data.pop("distritos"), ensure_ascii=False)
                db.add(ZonaDelivery(distritos=distritos, **data))
            print(f"  OK {len(ZONAS_DELIVERY)} zonas de delivery insertadas")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    print("Creando tablas y cargando datos iniciales...")
    seed()
    print("Listo.")