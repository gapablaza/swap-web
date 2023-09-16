import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBlacklistComponent } from './settings-blacklist.component';

describe('SettingsBlacklistComponent', () => {
  let component: SettingsBlacklistComponent;
  let fixture: ComponentFixture<SettingsBlacklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [SettingsBlacklistComponent]
});
    fixture = TestBed.createComponent(SettingsBlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
