import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionSummaryComponent } from './collection-summary.component';

describe('CollectionSummaryComponent', () => {
  let component: CollectionSummaryComponent;
  let fixture: ComponentFixture<CollectionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionSummaryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
