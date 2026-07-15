import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Buscar } from './pages/buscar/buscar';
import { Nosotros } from './pages/nosotros/nosotros';
import { Contacto } from './pages/contacto/contacto';
import { Promociones } from './pages/promociones/promociones';
import { Carritocompras } from './pages/carritocompras/carritocompras';
import { Delivery } from './pages/delivery/delivery';
import { Productos } from './pages/productos/productos';

export const routes: Routes = [
  { path: '', component: Inicio, pathMatch: 'full' },
  { path: 'catalogo', component: Productos },
  { path: 'promociones', component: Promociones },
  { path: 'delivery', component: Delivery },
  { path: 'contacto', component: Contacto },
  { path: 'nosotros', component: Nosotros },
  { path: 'buscar', component: Buscar },
  { path: 'carritocompras', component: Carritocompras },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: '**', redirectTo: '' },
];
