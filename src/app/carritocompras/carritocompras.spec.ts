import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carritocompras } from './carritocompras';

describe('Carritocompras', () => {
  let component: Carritocompras;
  let fixture: ComponentFixture<Carritocompras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carritocompras],
    }).compileComponents();

    fixture = TestBed.createComponent(Carritocompras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
