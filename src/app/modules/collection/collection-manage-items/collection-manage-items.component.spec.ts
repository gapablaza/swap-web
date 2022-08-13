import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionManageItemsComponent } from './collection-manage-items.component';

describe('CollectionManageItemsComponent', () => {
  let component: CollectionManageItemsComponent;
  let fixture: ComponentFixture<CollectionManageItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionManageItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionManageItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
