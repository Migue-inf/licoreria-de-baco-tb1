import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  contrasena = '';
  enviando = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private auth: AuthService,
    private carrito: CarritoService,
    private router: Router,
  ) {}

  async iniciarSesion() {
    if (!this.email || !this.contrasena) {
      this.mensaje = 'Por favor, completa todos los campos.';
      this.tipoMensaje = 'error';
      return;
    }
    this.enviando = true;
    this.mensaje = '';

    try {
      await new Promise<void>((resolve, reject) => {
        this.auth.login(this.email, this.contrasena).subscribe({
          next: () => resolve(),
          error: (err) => reject(err),
        });
      });
      // Sincronizar carrito local → BD después de iniciar sesión
      await this.carrito.sincronizarAlIniciarSesion();
      this.mensaje = '✅ Inicio de sesión exitoso. Redirigiendo...';
      this.tipoMensaje = 'exito';
      setTimeout(() => this.router.navigate(['/']), 1000);
    } catch (err: any) {
      this.mensaje = err.error?.detail || 'Error al iniciar sesión. Verifica tus credenciales.';
      this.tipoMensaje = 'error';
    } finally {
      this.enviando = false;
    }
  }
}
