import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UsuarioInfo {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface TokenRespuesta {
  access_token: string;
  token_type: string;
  usuario: UsuarioInfo;
}

const TOKEN_KEY = 'licoreria-baco-token';
const USUARIO_KEY = 'licoreria-baco-usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api/auth';
  private readonly usuarioSubject = new BehaviorSubject<UsuarioInfo | null>(this.cargarUsuario());
  private readonly tokenSubject = new BehaviorSubject<string | null>(this.cargarToken());

  readonly usuario$ = this.usuarioSubject.asObservable();
  readonly token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  get usuarioActual(): UsuarioInfo | null {
    return this.usuarioSubject.value;
  }

  get tokenActual(): string | null {
    return this.tokenSubject.value;
  }

  get estaLogueado(): boolean {
    return !!this.tokenActual && !!this.usuarioActual;
  }

  login(email: string, contrasena: string): Observable<TokenRespuesta> {
    return this.http
      .post<TokenRespuesta>(`${this.baseUrl}/login`, { email, contrasena })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  registro(nombre: string, email: string, contrasena: string, fechaNacimiento?: string): Observable<TokenRespuesta> {
    const body: any = { nombre, email, contrasena };
    if (fechaNacimiento) {
      body.fecha_nacimiento = fechaNacimiento;
    }
    return this.http
      .post<TokenRespuesta>(`${this.baseUrl}/registro`, body)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.tokenSubject.next(null);
    this.usuarioSubject.next(null);
  }

  private guardarSesion(respuesta: TokenRespuesta) {
    localStorage.setItem(TOKEN_KEY, respuesta.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.usuario));
    this.tokenSubject.next(respuesta.access_token);
    this.usuarioSubject.next(respuesta.usuario);
  }

  private cargarToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private cargarUsuario(): UsuarioInfo | null {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem(USUARIO_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as UsuarioInfo;
    } catch {
      return null;
    }
  }
}