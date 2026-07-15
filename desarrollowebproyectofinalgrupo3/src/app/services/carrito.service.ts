import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { ProductoCatalogo } from './catalogo-api.service';

export interface ItemCarrito {
  id: number;
  producto_id: number;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  icono: string;
  imagen?: string;
}

export interface ItemCarritoAPI {
  id: number;
  producto_id: number;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  icono: string | null;
  imagen: string | null;
}

const STORAGE_KEY = 'licoreria-baco-carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api/carrito';
  private readonly itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);

  readonly items$ = this.itemsSubject.asObservable();

  get itemsSnapshot() {
    return this.itemsSubject.value;
  }

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    // Siempre cargar desde localStorage primero (inmediato)
    const local = this.cargarLocal();
    this.itemsSubject.next(local);
    // Si está logueado, cargar desde BD en segundo plano (sobreescribe el local)
    if (this.auth.estaLogueado) {
      this.cargarDesdeAPI().catch(() => {});
    }
  }

  // ── Sincronización con autenticación ────────────────────────────────

  /** Sube items locales a la BD y luego recarga desde BD */
  async sincronizarAlIniciarSesion(): Promise<void> {
    const local = this.cargarLocal();
    for (const item of local) {
      try {
        await firstValueFrom(
          this.http.post<ItemCarritoAPI>(this.baseUrl, {
            producto_id: item.producto_id,
            nombre: item.nombre,
            categoria: item.categoria,
            precio: item.precio,
            cantidad: item.cantidad,
            icono: item.icono,
            imagen: item.imagen ?? null,
          }),
        );
      } catch {
        // Si ya existe, el backend incrementa cantidad, así que ignoramos
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    await this.cargarDesdeAPI();
  }

  /** Al cerrar sesión: limpia memoria y localStorage.
   *  Los items ya están persistidos en la BD, no se eliminan. */
  async sincronizarAlCerrarSesion(): Promise<void> {
    // Limpiar estado en memoria
    this.itemsSubject.next([]);
    // Limpiar localStorage para que no se mezclen items entre usuarios
    localStorage.removeItem(STORAGE_KEY);
  }

  // ── Operaciones del carrito (siempre optimistas: local inmediato + BD en background) ──

  agregar(producto: ProductoCatalogo) {
    const precio = this.extraerPrecio(producto.precio);
    const items = [...this.itemsSubject.value];
    const existente = items.find((item) => item.producto_id === producto.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      items.push({
        id: producto.id,
        producto_id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio,
        cantidad: 1,
        icono: producto.icono ?? '🛍️',
        imagen: producto.imagen,
      });
    }
    this.actualizarLocal(items);

    // Sincronizar con BD si está logueado (en segundo plano)
    if (this.auth.estaLogueado) {
      this.sincronizarItemEnBD(producto.id, producto.nombre, producto.categoria, precio, producto.icono ?? '🛍️', producto.imagen).catch(() => {});
    }
  }

  incrementar(productoId: number) {
    const items = this.itemsSubject.value.map((item) =>
      item.producto_id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item,
    );
    this.actualizarLocal(items);

    if (this.auth.estaLogueado) {
      const item = items.find((i) => i.producto_id === productoId);
      if (item) {
        this.enviarCantidadABD(item).catch(() => {});
      }
    }
  }

  decrementar(productoId: number) {
    const items = this.itemsSubject.value
      .map((item) =>
        item.producto_id === productoId && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item,
      )
      .filter((item) => item.cantidad > 0);
    this.actualizarLocal(items);

    if (this.auth.estaLogueado) {
      const item = items.find((i) => i.producto_id === productoId);
      if (item) {
        this.enviarCantidadABD(item).catch(() => {});
      } else {
        // Se eliminó el item (cantidad llegó a 0): eliminar de BD
        this.eliminarDeBD(productoId).catch(() => {});
      }
    }
  }

  eliminar(productoId: number) {
    this.actualizarLocal(this.itemsSubject.value.filter((item) => item.producto_id !== productoId));
    if (this.auth.estaLogueado) {
      this.eliminarDeBD(productoId).catch(() => {});
    }
  }

  vaciar() {
    this.actualizarLocal([]);
    if (this.auth.estaLogueado) {
      firstValueFrom(this.http.delete(this.baseUrl)).catch(() => {});
    }
  }

  get subtotal() {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  get totalItems() {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.cantidad, 0);
  }

  // ── Privados ────────────────────────────────────────────────────────

  private async cargarDesdeAPI() {
    try {
      const items = await firstValueFrom(this.http.get<ItemCarritoAPI[]>(this.baseUrl));
      const mapeados: ItemCarrito[] = items.map((item) => ({
        ...item,
        icono: item.icono ?? '🛍️',
        imagen: item.imagen ?? undefined,
      }));
      this.itemsSubject.next(mapeados);
      // Actualizar localStorage como cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapeados));
    } catch {
      // Si falla la API, mantenemos lo que haya en localStorage
    }
  }

  private async sincronizarItemEnBD(productoId: number, nombre: string, categoria: string, precio: number, icono: string, imagen?: string) {
    try {
      await firstValueFrom(
        this.http.post<ItemCarritoAPI>(this.baseUrl, {
          producto_id: productoId,
          nombre,
          categoria,
          precio,
          cantidad: 1,
          icono,
          imagen: imagen ?? null,
        }),
      );
      // Recargar desde BD para obtener IDs reales
      await this.cargarDesdeAPI();
    } catch {
      // Si el item ya existe el backend incrementa, recargamos
      await this.cargarDesdeAPI();
    }
  }

  private async enviarCantidadABD(item: ItemCarrito) {
    try {
      await firstValueFrom(
        this.http.put<ItemCarritoAPI>(`${this.baseUrl}/${item.id}`, { cantidad: item.cantidad }),
      );
    } catch {
      // Si falla (el ID puede no ser real aún del backend), hacemos un post/reemplazo
      await this.cargarDesdeAPI();
    }
  }

  private async eliminarDeBD(productoId: number) {
    // Buscar el item en la BD por producto_id (los items locales pueden tener id = producto_id temporalmente)
    try {
      const itemsBD = await firstValueFrom(this.http.get<ItemCarritoAPI[]>(this.baseUrl));
      const itemBD = itemsBD.find((i) => i.producto_id === productoId);
      if (itemBD) {
        await firstValueFrom(this.http.delete(`${this.baseUrl}/${itemBD.id}`));
      }
    } catch {
      // Si falla, no importa
    }
  }

  private actualizarLocal(items: ItemCarrito[]) {
    this.itemsSubject.next(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private cargarLocal(): ItemCarrito[] {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data) as ItemCarrito[];
      return parsed.filter((item) => item && typeof item.producto_id === 'number');
    } catch {
      return [];
    }
  }

  private extraerPrecio(precio: string): number {
    const limpio = precio.replace(/[^\d.,]/g, '').replace(',', '.');
    return Number.parseFloat(limpio) || 0;
  }
}