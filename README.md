# Licorería de Baco

Este proyecto fue desarrollado para el TB1 del curso Desarrollo para Entorno Web. La idea principal es crear una página web informativa para la Licorería de Baco, mostrando de forma ordenada sus productos, promociones, horarios, ubicación y medios de contacto.

El proyecto se trabajó como una propuesta frontend, por lo que no incluye base de datos, backend, inicio de sesión, registro de usuarios ni pagos en línea. El objetivo en esta etapa es presentar una página funcional y entendible, usando las tecnologías vistas durante las primeras semanas del curso.

## Tecnologías usadas

Para el desarrollo se utilizaron las siguientes herramientas:

* Angular
* TypeScript
* HTML5
* CSS3
* Bootstrap 5
* Visual Studio Code
* Git y GitHub

## Integrantes

* Miguel Angel Cancho Infante — U202324159
* Juan Daniel Castro Taype — U202111026
* Jhonatan Freddy Ccoyso Huaman — U202421459
* Jefry Rojas Perez — U202313424
* Alejandro Gerardo Zevallos Chacon — U202216681

## Secciones de la página

La página cuenta con las siguientes secciones principales:

- Inicio: presenta la licorería y una breve descripción del negocio.
- Nosotros: explica de forma sencilla la propuesta de la licorería.
- Catálogo: muestra productos organizados por categorías como vinos, cervezas, whiskies, rones, vodkas, pisco y otros licores.
- Verificación de edad: antes de ver el catálogo, el usuario debe confirmar que es mayor de 18 años.
- Promociones: muestra algunas ofertas referenciales.
- Contacto: incluye horario, ubicación, teléfono y acceso directo por WhatsApp.

Los productos, precios y promociones son datos referenciales usados solo para fines académicos.

## Cómo ejecutar el proyecto

Primero se deben instalar las dependencias:

```bash
npm install
```

Luego se ejecuta el proyecto con:

```bash
ng serve
```

También se puede usar:

```bash
npm start
```

Después de ejecutar el proyecto, se abre en el navegador con la siguiente dirección:

```text
http://localhost:4200/
```

## Estructura principal del proyecto

La estructura principal utilizada es la siguiente:

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

Además, el proyecto cuenta con archivos de configuración propios de Angular como `angular.json`, `package.json`, `tsconfig.json` y otros archivos necesarios para su ejecución.

## Rutas de la página

La navegación se organizó con rutas simples:

* `/` para la página de inicio.
* `/catalogo` para el catálogo de productos.
* `/promociones` para las promociones.
* `/contacto` para los medios de contacto.

## Comentario final

Este avance busca mostrar una solución web sencilla, ordenada y fácil de usar para mejorar la presencia digital de la Licorería de Baco. También se consideró el consumo responsable, por eso se agregó la verificación de mayoría de edad antes de mostrar los productos.

