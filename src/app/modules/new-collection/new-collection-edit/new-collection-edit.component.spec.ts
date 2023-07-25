import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionEditComponent } from './new-collection-edit.component';

describe('NewCollectionEditComponent', () => {
  let component: NewCollectionEditComponent;
  let fixture: ComponentFixture<NewCollectionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCollectionEditComponent]
    });
    fixture = TestBed.createComponent(NewCollectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
