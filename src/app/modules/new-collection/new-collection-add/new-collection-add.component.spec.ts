import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionAddComponent } from './new-collection-add.component';

describe('NewCollectionAddComponent', () => {
  let component: NewCollectionAddComponent;
  let fixture: ComponentFixture<NewCollectionAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCollectionAddComponent]
    });
    fixture = TestBed.createComponent(NewCollectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
