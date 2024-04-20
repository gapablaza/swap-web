import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFeedsComponent } from './home-feeds.component';

describe('HomeFeedsComponent', () => {
  let component: HomeFeedsComponent;
  let fixture: ComponentFixture<HomeFeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFeedsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
