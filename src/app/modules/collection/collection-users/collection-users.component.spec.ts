import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionUsersComponent } from './collection-users.component';

describe('CollectionUsersComponent', () => {
  let component: CollectionUsersComponent;
  let fixture: ComponentFixture<CollectionUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionUsersComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
