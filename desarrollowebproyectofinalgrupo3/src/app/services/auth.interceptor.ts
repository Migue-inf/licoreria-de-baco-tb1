import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const token = auth.tokenActual;

  if (token && req.url.startsWith('http://127.0.0.1:8000')) {
    const clonada = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(clonada);
  }

  return next(req);
};