import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarritoService, ItemCarrito } from '../../services/carrito.service';

@Component({
  selector: 'app-carritocompras',
  imports: [CommonModule],
  templateUrl: './carritocompras.html',
  styleUrl: './carritocompras.css',
})
export class Carritocompras implements OnInit {
  items: ItemCarrito[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.items = this.carritoService.itemsSnapshot;
    this.carritoService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  get subtotal() {
    return this.carritoService.subtotal;
  }

  get totalItems() {
    return this.carritoService.totalItems;
  }

  incrementar(item: ItemCarrito) {
    this.carritoService.incrementar(item.producto_id);
  }

  decrementar(item: ItemCarrito) {
    this.carritoService.decrementar(item.producto_id);
  }

  eliminar(item: ItemCarrito) {
    this.carritoService.eliminar(item.producto_id);
  }

  vaciarCarrito() {
    this.carritoService.vaciar();
  }

  formatearPrecio(valor: number): string {
    return `S/ ${valor.toFixed(2)}`;
  }
}
