import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionManageTradelistComponent } from './collection-manage-tradelist.component';

describe('CollectionManageTradelistComponent', () => {
  let component: CollectionManageTradelistComponent;
  let fixture: ComponentFixture<CollectionManageTradelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionManageTradelistComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CollectionManageTradelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
