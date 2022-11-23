import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDeleteComponent } from './settings-delete.component';

describe('SettingsDeleteComponent', () => {
  let component: SettingsDeleteComponent;
  let fixture: ComponentFixture<SettingsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
