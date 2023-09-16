import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionImageComponent } from './new-collection-image.component';

describe('NewCollectionImageComponent', () => {
  let component: NewCollectionImageComponent;
  let fixture: ComponentFixture<NewCollectionImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [NewCollectionImageComponent]
});
    fixture = TestBed.createComponent(NewCollectionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
