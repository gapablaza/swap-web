import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChecklistComponent } from './new-checklist.component';

describe('NewChecklistComponent', () => {
  let component: NewChecklistComponent;
  let fixture: ComponentFixture<NewChecklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewChecklistComponent]
    });
    fixture = TestBed.createComponent(NewChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
