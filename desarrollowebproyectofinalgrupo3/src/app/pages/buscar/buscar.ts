import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoApiService, ResultadoBusqueda } from '../../services/catalogo-api.service';

@Component({
  selector: 'app-buscar',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css',
})
export class Buscar {
  termino = '';
  buscado = false;
  resultados: ResultadoBusqueda[] = [];

  constructor(private catalogoApi: CatalogoApiService) {}

  buscar() {
    const q = this.termino.trim().toLowerCase();
    this.buscado = true;
    if (!q) {
      this.resultados = [];
      return;
    }

    this.catalogoApi.buscarProductos(q).subscribe({
      next: (respuesta) => {
        this.resultados = respuesta;
      },
      error: () => {
        this.resultados = [];
      },
    });
  }

  limpiar() {
    this.termino = '';
    this.buscado = false;
    this.resultados = [];
  }
}
