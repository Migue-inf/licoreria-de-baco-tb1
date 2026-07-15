import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  totalItems = 0;
  usuarioNombre = '';

  constructor(
    private carritoService: CarritoService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.usuarioNombre = this.auth.usuarioActual?.nombre ?? '';
    this.auth.usuario$.subscribe((usuario) => {
      this.usuarioNombre = usuario?.nombre ?? '';
    });

    this.totalItems = this.carritoService.totalItems;
    this.carritoService.items$.subscribe(() => {
      this.totalItems = this.carritoService.totalItems;
    });
  }

  async cerrarSesion() {
    await this.carritoService.sincronizarAlCerrarSesion();
    this.auth.logout();
    this.totalItems = 0;
    // Limpiar verificación de edad para que la pida de nuevo
    localStorage.removeItem('licoreria-baco-mayoredad');
    // Redirigir al home recargando la página completamente
    window.location.href = '/';
  }
}
