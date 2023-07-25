import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionListComponent } from './new-collection-list.component';

describe('NewCollectionListComponent', () => {
  let component: NewCollectionListComponent;
  let fixture: ComponentFixture<NewCollectionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCollectionListComponent]
    });
    fixture = TestBed.createComponent(NewCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
