import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProfileImageComponent } from './settings-profile-image.component';

describe('SettingsProfileImageComponent', () => {
  let component: SettingsProfileImageComponent;
  let fixture: ComponentFixture<SettingsProfileImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SettingsProfileImageComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
