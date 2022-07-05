import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConnectComponent } from './settings-connect.component';

describe('SettingsConnectComponent', () => {
  let component: SettingsConnectComponent;
  let fixture: ComponentFixture<SettingsConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
