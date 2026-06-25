import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  loginExitoso = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (isPlatformBrowser(this.platformId)) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const { email, password } = this.form.value;
      const encontrado = usuarios.find((u: any) => u.email === email && u.password === password);

      if (encontrado) {
        this.loginError = false;
        this.loginExitoso = true;
        setTimeout(() => this.router.navigate(['/inicio']), 2000);
      } else {
        this.loginError = true;
      }
    }
  }
}
