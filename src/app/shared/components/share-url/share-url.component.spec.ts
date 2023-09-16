import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUrlComponent } from './share-url.component';

describe('ShareUrlComponent', () => {
  let component: ShareUrlComponent;
  let fixture: ComponentFixture<ShareUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShareUrlComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
