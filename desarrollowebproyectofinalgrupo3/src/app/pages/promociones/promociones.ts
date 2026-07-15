import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CatalogoApiService, PromocionVista } from '../../services/catalogo-api.service';

@Component({
  selector: 'app-promociones',
  imports: [CommonModule],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css',
})
export class Promociones implements OnInit {
  promociones: PromocionVista[] = [];

  constructor(
    private catalogoApi: CatalogoApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.catalogoApi.obtenerPromociones().subscribe({
      next: (respuesta) => {
        this.promociones = respuesta;
        this.cdr.detectChanges();
      },
      error: () => {
        this.promociones = [];
        this.cdr.detectChanges();
      },
    });
  }
}
