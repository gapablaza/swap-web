import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionChecklistComponent } from './new-collection-checklist.component';

describe('NewCollectionChecklistComponent', () => {
  let component: NewCollectionChecklistComponent;
  let fixture: ComponentFixture<NewCollectionChecklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [NewCollectionChecklistComponent]
});
    fixture = TestBed.createComponent(NewCollectionChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
