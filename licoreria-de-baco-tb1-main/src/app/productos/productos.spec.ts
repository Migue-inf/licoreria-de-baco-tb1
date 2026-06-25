import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productos } from './productos';

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productos],
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all products and four pages by default', () => {
    expect(component.categoriaSeleccionada).toBe('Todas');
    expect(component.productosFiltrados.length).toBe(15);
    expect(component.totalPaginas).toBe(4);
  });

  it('should filter products by category and return to page one', () => {
    component.paginaActual = 3;
    component.seleccionarCategoria('Cervezas');

    expect(component.paginaActual).toBe(1);
    expect(component.productosFiltrados.length).toBe(2);
    expect(component.productosFiltrados[0].categoria).toBe('Cervezas');
  });

  it('should display four products per page', () => {
    component.confirmarEdad();
    component.cambiarPagina(2);

    expect(component.productosPaginados.length).toBe(4);
    expect(component.paginaActual).toBe(2);
  });
});
