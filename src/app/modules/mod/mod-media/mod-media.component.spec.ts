import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModMediaComponent } from './mod-media.component';

describe('ModMediaComponent', () => {
  let component: ModMediaComponent;
  let fixture: ComponentFixture<ModMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
