# Licorería de Baco

Proyecto frontend desarrollado para el TB1 del curso Desarrollo para Entorno Web.
La aplicación presenta información de la Licorería de Baco, su catálogo de productos,
promociones, horario, ubicación y medios de contacto.

El alcance es únicamente informativo. No incluye backend, base de datos, login,
registro de usuarios ni pasarela de pagos.

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap 5
- Visual Studio Code
- Git y GitHub

## Integrantes

- Miguel Angel Cancho Infante — U202324159
- Juan Daniel Castro Taype — U202111026
- Jhonatan Freddy Ccoyso Huaman — U202421459
- Jefry Rojas Perez — U202313424
- Alejandro Gerardo Zevallos Chacon — U202216681

## Secciones de la página

- **Inicio y Nosotros:** banner principal, presentación de la licorería y mensaje de consumo responsable.
- **Catálogo:** página separada con filtro por categorías, 15 productos de ejemplo y paginación.
- **Verificación de edad:** confirmación de mayoría de edad antes de mostrar los productos.
- **Promociones:** página separada con tres ofertas referenciales.
- **Contacto:** página separada con teléfono, WhatsApp, horario y enlace a Google Maps.

## Cómo ejecutar el proyecto

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:

   ```bash
   ng serve
   ```

3. Abrir en el navegador:

   ```text
   http://localhost:4200/
   ```

También se puede iniciar con:

```bash
npm start
```

## Estructura principal

```text
src/
├── app/
│   ├── inicio/
│   ├── nosotros/
│   ├── productos/
│   ├── promociones/
│   └── contacto/
├── img/
└── styles.css
```

La página utiliza Angular Router con cuatro rutas sencillas:

- `/` para Inicio y Nosotros.
- `/catalogo` para productos, filtros y paginación.
- `/promociones` para las ofertas.
- `/contacto` para los medios de contacto y ubicación.

El catálogo muestra la opción **Todas** por defecto. Cada filtro reinicia la página en
el número 1 y la paginación se calcula de acuerdo con los productos encontrados.

## Datos referenciales

Los precios y el horario son datos referenciales para fines académicos. La sección
de contacto muestra la ubicación en la Av. Caminos del Inca, Santiago de Surco 15039,
un enlace directo a Google Maps y el teléfono que ya figuraba en el proyecto original.

## Commits sugeridos para la evidencia

1. `feat: crear estructura base de la página`
2. `feat: implementar inicio y navegación`
3. `feat: implementar catálogo de productos`
4. `feat: implementar promociones y contacto`
5. `feat: implementar verificación de edad`
6. `style: mejorar diseño responsive`
7. `docs: actualizar README`
