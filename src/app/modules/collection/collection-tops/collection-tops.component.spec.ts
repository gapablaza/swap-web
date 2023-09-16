import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTopsComponent } from './collection-tops.component';

describe('CollectionTopsComponent', () => {
  let component: CollectionTopsComponent;
  let fixture: ComponentFixture<CollectionTopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionTopsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
