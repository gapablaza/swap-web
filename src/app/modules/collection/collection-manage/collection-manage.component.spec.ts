import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionManageComponent } from './collection-manage.component';

describe('CollectionManageComponent', () => {
  let component: CollectionManageComponent;
  let fixture: ComponentFixture<CollectionManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionManageComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CollectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
