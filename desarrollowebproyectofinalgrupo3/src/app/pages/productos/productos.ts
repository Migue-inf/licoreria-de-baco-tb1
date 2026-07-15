import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CatalogoApiService, ProductoCatalogo } from '../../services/catalogo-api.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

type Producto = ProductoCatalogo;

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  mayorEdad = typeof localStorage !== 'undefined'
    ? this.estaLogueado || localStorage.getItem('licoreria-baco-mayoredad') === 'true'
    : false;
  edadRechazada = false;

  private get estaLogueado(): boolean {
    try {
      const token = localStorage.getItem('licoreria-baco-token');
      return !!token;
    } catch {
      return false;
    }
  }
  categoriaSeleccionada = 'Todas';
  paginaActual = 1;
  productosPorPagina = 50;

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

  productos: Producto[] = [];
  mensajeCarrito = '';

  constructor(
    private catalogoApi: CatalogoApiService,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.catalogoApi.listarProductos('Todas', 1, 50).subscribe({
      next: (respuesta) => {
        this.productos = respuesta.items;
        this.cdr.detectChanges();
      },
      error: () => {
        this.productos = [];
        this.cdr.detectChanges();
      },
    });
  }

  get productosFiltrados() {
    if (this.categoriaSeleccionada === 'Todas') {
      return this.productos;
    }
    return this.productos.filter(
      (p) => p.categoria === this.categoriaSeleccionada,
    );
  }

  get productosPaginados() {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.productosPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }

  get paginas() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  verificarEdad() {
    this.mayorEdad = true;
    this.edadRechazada = false;
    localStorage.setItem('licoreria-baco-mayoredad', 'true');
  }

  rechazarEdad() {
    this.mayorEdad = false;
    this.edadRechazada = true;
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
    this.mensajeCarrito = `✅ "${producto.nombre}" agregado al carrito`;
    setTimeout(() => (this.mensajeCarrito = ''), 2000);
  }
}