import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherListComponent } from './publisher-list.component';

describe('PublisherListComponent', () => {
  let component: PublisherListComponent;
  let fixture: ComponentFixture<PublisherListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PublisherListComponent]
    });
    fixture = TestBed.createComponent(PublisherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
