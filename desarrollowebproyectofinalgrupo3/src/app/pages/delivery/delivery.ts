import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CatalogoApiService, ZonaDeliveryVista } from '../../services/catalogo-api.service';

@Component({
  selector: 'app-delivery',
  imports: [CommonModule],
  templateUrl: './delivery.html',
  styleUrl: './delivery.css',
})
export class Delivery implements OnInit {
  zonas: ZonaDeliveryVista[] = [];
  cargando = false;
  errorCarga = '';

  constructor(private catalogoApi: CatalogoApiService) {}

  ngOnInit() {
    this.cargando = true;
    this.catalogoApi.obtenerZonasDelivery().subscribe({
      next: (respuesta) => {
        this.zonas = respuesta;
        this.cargando = false;
      },
      error: () => {
        this.zonas = [];
        this.cargando = false;
        this.errorCarga = 'No se pudieron cargar las zonas de delivery desde la base de datos.';
      },
    });
  }
}
