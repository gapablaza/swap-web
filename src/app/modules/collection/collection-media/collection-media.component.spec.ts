import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMediaComponent } from './collection-media.component';

describe('CollectionMediaComponent', () => {
  let component: CollectionMediaComponent;
  let fixture: ComponentFixture<CollectionMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionMediaComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
