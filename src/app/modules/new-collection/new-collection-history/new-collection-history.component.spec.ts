import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectionHistoryComponent } from './new-collection-history.component';

describe('NewCollectionHistoryComponent', () => {
  let component: NewCollectionHistoryComponent;
  let fixture: ComponentFixture<NewCollectionHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [NewCollectionHistoryComponent]
});
    fixture = TestBed.createComponent(NewCollectionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
