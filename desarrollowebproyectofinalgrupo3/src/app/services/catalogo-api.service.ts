import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface ProductoApi {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  icono: string | null;
  activo: boolean;
}

interface ProductosPaginadosApi {
  items: ProductoApi[];
  total: number;
  pagina: number;
  total_paginas: number;
  categoria: string;
}

interface PromocionApi {
  id: number;
  titulo: string;
  descripcion: string;
  precio_texto: string;
  badge: string;
  activo: boolean;
}

interface ZonaDeliveryApi {
  id: number;
  nombre: string;
  distritos: string[];
  costo_min: number;
  costo_max: number;
}

export interface ProductoCatalogo {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string;
  imagen?: string;
  icono?: string;
}

export interface ProductosPaginados {
  items: ProductoCatalogo[];
  total: number;
  pagina: number;
  totalPaginas: number;
  categoria: string;
}

export interface ResultadoBusqueda {
  nombre: string;
  categoria: string;
  precio: string;
  icono: string;
}

export interface PromocionVista {
  titulo: string;
  descripcion: string;
  precioTexto: string;
  badge: string;
}

export interface ZonaDeliveryVista {
  nombre: string;
  distritos: string[];
  costoMin: number;
  costoMax: number;
}

@Injectable({ providedIn: 'root' })
export class CatalogoApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  listarProductos(
    categoria = 'Todas',
    pagina = 1,
    limite = 50,
  ): Observable<ProductosPaginados> {
    const params = new HttpParams()
      .set('categoria', categoria)
      .set('pagina', pagina)
      .set('limite', limite);

    return this.http
      .get<ProductosPaginadosApi>(`${this.baseUrl}/productos`, { params })
      .pipe(
        map((respuesta) => ({
          items: respuesta.items.map((producto) => this.mapProducto(producto)),
          total: respuesta.total,
          pagina: respuesta.pagina,
          totalPaginas: respuesta.total_paginas,
          categoria: respuesta.categoria,
        })),
      );
  }

  buscarProductos(termino: string): Observable<ResultadoBusqueda[]> {
    const params = new HttpParams().set('q', termino);
    return this.http
      .get<ProductoApi[]>(`${this.baseUrl}/productos/buscar`, { params })
      .pipe(
        map((productos) =>
          productos.map((producto) => ({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: this.formatearPrecio(producto.precio),
            icono: producto.icono ?? '🍸',
          })),
        ),
      );
  }

  obtenerPromociones(): Observable<PromocionVista[]> {
    return this.http
      .get<PromocionApi[]>(`${this.baseUrl}/promociones`)
      .pipe(
        map((promociones) =>
          promociones.map((promocion) => ({
            titulo: promocion.titulo,
            descripcion: promocion.descripcion,
            precioTexto: promocion.precio_texto,
            badge: promocion.badge,
          })),
        ),
      );
  }

  obtenerZonasDelivery(): Observable<ZonaDeliveryVista[]> {
    return this.http
      .get<ZonaDeliveryApi[]>(`${this.baseUrl}/delivery/zonas`)
      .pipe(
        map((zonas) =>
          zonas.map((zona) => ({
            nombre: zona.nombre,
            distritos: zona.distritos,
            costoMin: zona.costo_min,
            costoMax: zona.costo_max,
          })),
        ),
      );
  }

  private mapProducto(producto: ProductoApi): ProductoCatalogo {
    return {
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio: this.formatearPrecio(producto.precio),
      imagen: this.normalizarImagen(producto.imagen),
      icono: producto.icono ?? undefined,
    };
  }

  private formatearPrecio(precio: number): string {
    return `S/ ${precio.toFixed(2)}`;
  }

  private normalizarImagen(imagen: string | null): string | undefined {
    if (!imagen) {
      return undefined;
    }

    const imagenNormalizada = imagen.startsWith('http') || imagen.startsWith('/')
      ? imagen
      : `/${imagen}`;

    return imagenNormalizada.replace(
      '/assets/img/Ron_Flor_de_Caña_5_años.jpg',
      '/assets/img/Ron_Flor_de_Cana_5_anios.jpg',
    );
  }
}