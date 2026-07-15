import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nombre = '';
  email = '';
  contrasena = '';
  confirmar = '';
  fechaNacimiento = '';
  enviando = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(
    private auth: AuthService,
    private carrito: CarritoService,
    private router: Router,
  ) {}

  private calcularEdad(fecha: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  async crearCuenta() {
    if (!this.nombre || !this.email || !this.contrasena || !this.confirmar || !this.fechaNacimiento) {
      this.mensaje = 'Por favor, completa todos los campos.';
      this.tipoMensaje = 'error';
      return;
    }
    if (this.contrasena !== this.confirmar) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.tipoMensaje = 'error';
      return;
    }
    if (this.contrasena.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      this.tipoMensaje = 'error';
      return;
    }
    if (this.calcularEdad(this.fechaNacimiento) < 18) {
      this.mensaje = 'Debes ser mayor de 18 años para registrarte.';
      this.tipoMensaje = 'error';
      return;
    }
    this.enviando = true;
    this.mensaje = '';

    try {
      await new Promise<void>((resolve, reject) => {
        this.auth.registro(this.nombre, this.email, this.contrasena, this.fechaNacimiento).subscribe({
          next: () => resolve(),
          error: (err) => reject(err),
        });
      });
      // Sincronizar carrito local → BD después del registro (auto-login)
      await this.carrito.sincronizarAlIniciarSesion();
      this.mensaje = '✅ Registro exitoso. Redirigiendo...';
      this.tipoMensaje = 'exito';
      setTimeout(() => this.router.navigate(['/']), 1000);
    } catch (err: any) {
      if (err.status === 409) {
        this.mensaje = 'Ya existe una cuenta con ese correo electrónico.';
      } else if (err.error?.detail?.includes('mayor de 18')) {
        this.mensaje = 'Debes ser mayor de 18 años para registrarte.';
      } else {
        this.mensaje = err.error?.detail || 'Error al registrar. Intenta de nuevo.';
      }
      this.tipoMensaje = 'error';
    } finally {
      this.enviando = false;
    }
  }
}
