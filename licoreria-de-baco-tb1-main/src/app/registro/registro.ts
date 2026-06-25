import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  form: FormGroup;
  mostrarCalendario = false;
  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  diasCalendario: (number | null)[] = [];
  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
            'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  registroExitoso = false;
  modoSeleccion: 'dia' | 'anio' = 'dia';
  aniosDisponibles: number[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      nombre:   ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email:    ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fechaNac: ['', Validators.required]
    });
    this.generarCalendario();
    this.generarAnios();
  }

  generarAnios() {
    const anioActual = new Date().getFullYear();
    for (let a = anioActual; a >= anioActual - 100; a--) {
      this.aniosDisponibles.push(a);
    }
  }

  generarCalendario() {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const diasEnMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    this.diasCalendario = [];
    for (let i = 0; i < primerDia; i++) this.diasCalendario.push(null);
    for (let d = 1; d <= diasEnMes; d++) this.diasCalendario.push(d);
  }

  mesAnterior() {
    if (this.mesActual === 0) { this.mesActual = 11; this.anioActual--; }
    else this.mesActual--;
    this.generarCalendario();
  }

  mesSiguiente() {
    if (this.mesActual === 11) { this.mesActual = 0; this.anioActual++; }
    else this.mesActual++;
    this.generarCalendario();
  }

  seleccionarAnio(anio: number) {
    this.anioActual = anio;
    this.modoSeleccion = 'dia';
    this.generarCalendario();
  }

  seleccionarDia(dia: number | null) {
    if (!dia) return;
    const fecha = `${dia.toString().padStart(2,'0')}/${(this.mesActual+1).toString().padStart(2,'0')}/${this.anioActual}`;
    this.form.get('fechaNac')?.setValue(fecha);
    this.mostrarCalendario = false;
  }

  esDiaSeleccionado(dia: number | null): boolean {
    if (!dia) return false;
    const fecha = `${dia.toString().padStart(2,'0')}/${(this.mesActual+1).toString().padStart(2,'0')}/${this.anioActual}`;
    return this.form.get('fechaNac')?.value === fecha;
  }

  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (isPlatformBrowser(this.platformId)) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push(this.form.value);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    this.registroExitoso = true;
    setTimeout(() => this.router.navigate(['/inicio']), 2000);
  }
  abrirSelectorAnio(event: Event) {
  event.stopPropagation();
  this.modoSeleccion = 'anio';
}
}