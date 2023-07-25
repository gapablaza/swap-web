import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionProfileComponent } from './new-collection-profile.component';

describe('NewCollectionProfileComponent', () => {
  let component: NewCollectionProfileComponent;
  let fixture: ComponentFixture<NewCollectionProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCollectionProfileComponent]
    });
    fixture = TestBed.createComponent(NewCollectionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
