import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionManageWishlistComponent } from './collection-manage-wishlist.component';

describe('CollectionManageWishlistComponent', () => {
  let component: CollectionManageWishlistComponent;
  let fixture: ComponentFixture<CollectionManageWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionManageWishlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionManageWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
