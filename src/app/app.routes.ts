import { Routes } from '@angular/router';
import { Contacto } from './contacto/contacto';
import { Inicio } from './inicio/inicio';
import { Productos } from './productos/productos';
import { Promociones } from './promociones/promociones';

export const routes: Routes = [
  {
    path: '',
    component: Inicio,
    pathMatch: 'full',
  },
  {
    path: 'catalogo',
    component: Productos,
  },
  {
    path: 'promociones',
    component: Promociones,
  },
  {
    path: 'contacto',
    component: Contacto,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
