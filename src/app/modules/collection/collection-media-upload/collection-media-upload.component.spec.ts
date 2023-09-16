import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMediaUploadComponent } from './collection-media-upload.component';

describe('CollectionMediaUploadComponent', () => {
  let component: CollectionMediaUploadComponent;
  let fixture: ComponentFixture<CollectionMediaUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CollectionMediaUploadComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CollectionMediaUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
