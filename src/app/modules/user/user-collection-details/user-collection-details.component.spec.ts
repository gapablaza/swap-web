import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCollectionDetailsComponent } from './user-collection-details.component';

describe('UserCollectionDetailsComponent', () => {
  let component: UserCollectionDetailsComponent;
  let fixture: ComponentFixture<UserCollectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCollectionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCollectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
