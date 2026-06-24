import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Producto {
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string;
  imagen?: string;
  icono?: string;
}

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  mayorEdad = false;
  mensajeEdad = '';
  categoriaSeleccionada = 'Todas';
  paginaActual = 1;
  productosPorPagina = 4;

  categorias = [
    'Todas',
    'Vinos',
    'Cervezas',
    'Whiskies',
    'Rones',
    'Vodkas',
    'Pisco',
    'Otros licores',
  ];

  productos: Producto[] = [
    {
      nombre: 'Vino tinto clásico',
      categoria: 'Vinos',
      descripcion: 'Una opción suave para acompañar cenas y reuniones.',
      precio: 'S/ 39.90',
      icono: '🍷',
    },
    {
      nombre: 'Vino blanco',
      categoria: 'Vinos',
      descripcion: 'Vino fresco para compartir en almuerzos y celebraciones.',
      precio: 'S/ 42.90',
      icono: '🍾',
    },
    {
      nombre: 'Cerveza Pilsen 6 pack',
      categoria: 'Cervezas',
      descripcion: 'Pack de seis latas para compartir bien frías.',
      precio: 'S/ 21.70',
      imagen: 'assets/img/Cerveza_Pilse_6pck_355ml.jpg',
    },
    {
      nombre: 'Cerveza artesanal',
      categoria: 'Cervezas',
      descripcion: 'Cerveza referencial de sabor intenso y presentación individual.',
      precio: 'S/ 12.90',
      icono: '🍺',
    },
    {
      nombre: 'Whisky Johnnie Walker',
      categoria: 'Whiskies',
      descripcion: 'Whisky para celebraciones y ocasiones especiales.',
      precio: 'S/ 169.90',
      imagen: 'assets/img/Blue_Label_1Lt.jpg',
    },
    {
      nombre: 'Whisky escocés',
      categoria: 'Whiskies',
      descripcion: 'Botella referencial para brindar en una reunión especial.',
      precio: 'S/ 89.90',
      icono: '🥃',
    },
    {
      nombre: 'Ron Flor de Caña',
      categoria: 'Rones',
      descripcion: 'Ron añejo de sabor equilibrado, botella de 750 ml.',
      precio: 'S/ 49.90',
      imagen: 'assets/img/Ron_Flor_de_Caña_5_años.jpg',
    },
    {
      nombre: 'Ron dorado',
      categoria: 'Rones',
      descripcion: 'Ron referencial para preparar cócteles y mezclas sencillas.',
      precio: 'S/ 44.90',
      icono: '🥃',
    },
    {
      nombre: 'Vodka Absolut',
      categoria: 'Vodkas',
      descripcion: 'Vodka clásico para preparar distintos cócteles.',
      precio: 'S/ 59.90',
      imagen: 'assets/img/Vodka_Absolute_700ml.jpg',
    },
    {
      nombre: 'Vodka Smirnoff',
      categoria: 'Vodkas',
      descripcion: 'Botella de 700 ml, ideal para mezclar y compartir.',
      precio: 'S/ 39.90',
      imagen: 'assets/img/Vodka_smirnoff_700ml.jpeg',
    },
    {
      nombre: 'Pisco Portón',
      categoria: 'Pisco',
      descripcion: 'Pisco peruano para chilcanos, sours y brindis.',
      precio: 'S/ 85.90',
      imagen: 'assets/img/Pisco_Porton_750ml',
    },
    {
      nombre: 'Pisco quebranta',
      categoria: 'Pisco',
      descripcion: 'Pisco referencial para preparar bebidas peruanas.',
      precio: 'S/ 55.90',
      icono: '🍸',
    },
    {
      nombre: 'Licor de crema',
      categoria: 'Otros licores',
      descripcion: 'Licor dulce y suave para servir frío o acompañar postres.',
      precio: 'S/ 45.90',
      icono: '🥃',
    },
    {
      nombre: 'Tequila clásico',
      categoria: 'Otros licores',
      descripcion: 'Botella referencial para reuniones y celebraciones.',
      precio: 'S/ 69.90',
      icono: '🍸',
    },
    {
      nombre: 'Licor de anís',
      categoria: 'Otros licores',
      descripcion: 'Licor tradicional de sabor dulce y aroma característico.',
      precio: 'S/ 35.90',
      icono: '🥂',
    },
  ];

  get productosFiltrados() {
    if (this.categoriaSeleccionada === 'Todas') {
      return this.productos;
    }

    return this.productos.filter(
      (producto) => producto.categoria === this.categoriaSeleccionada,
    );
  }

  get productosPaginados() {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }

  get paginas() {
    return Array.from({ length: this.totalPaginas }, (_, indice) => indice + 1);
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  confirmarEdad() {
    this.mayorEdad = true;
    this.mensajeEdad = '';
  }

  rechazarEdad() {
    this.mayorEdad = false;
    this.mensajeEdad = 'No podemos mostrar el catálogo a menores de 18 años.';
  }
}
