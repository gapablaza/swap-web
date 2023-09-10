import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
} from 'ngx-image-cropper';
import { take } from 'rxjs';
import { MediaService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-collection-media-upload',
  templateUrl: './collection-media-upload.component.html',
  styleUrls: ['./collection-media-upload.component.scss'],
})
export class CollectionMediaUploadComponent implements OnInit {
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  imageSelected = false;
  imgDescription = '';
  isSaving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collectionId: number },
    private dialogRef: MatDialogRef<CollectionMediaUploadComponent>,
    private mediaSrv: MediaService,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    // this.imageSelected = true;
    // this.croppedImage = event.base64;
  }

  // imageLoaded(image: LoadedImage) {
  imageLoaded() {
    this.imageSelected = true;
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  onRotate() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  onFullZoomOut() {
    this.scale = 1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  onChangeScale(event: MatSliderChange) {
    this.scale = event.value ? event.value : 1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  onFullZoomIn() {
    this.scale = 5;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  onClose() {
    if (!this.isSaving) {
      this.dialogRef.close();
    }
  }

  onSaveImage() {
    this.isSaving = true;
    const newImage = this.cropper.crop();
    this.croppedImage = newImage?.base64;

    this.mediaSrv
      .addImage(this.imgDescription, this.croppedImage, this.data.collectionId)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.uiSrv.showSuccess(
            'Imagen subida, a esperar que un moderador la valide!'
          );
          this.dialogRef.close({
            created: Math.floor(new Date().getTime() / 1000),
            description: this.imgDescription,
            id: resp,
          });
        },
        error: (err) => {
          console.log('addImage', err);
          this.isSaving = false;
        },
      });
  }
}
