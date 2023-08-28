import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModPublishComponent } from './mod-publish.component';

describe('ModPublishComponent', () => {
  let component: ModPublishComponent;
  let fixture: ComponentFixture<ModPublishComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModPublishComponent]
    });
    fixture = TestBed.createComponent(ModPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
