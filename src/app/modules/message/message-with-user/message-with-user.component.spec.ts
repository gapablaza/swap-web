import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageWithUserComponent } from './message-with-user.component';

describe('MessageWithUserComponent', () => {
  let component: MessageWithUserComponent;
  let fixture: ComponentFixture<MessageWithUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MessageWithUserComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MessageWithUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
