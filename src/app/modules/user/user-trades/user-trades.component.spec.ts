import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTradesComponent } from './user-trades.component';

describe('UserTradesComponent', () => {
  let component: UserTradesComponent;
  let fixture: ComponentFixture<UserTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
