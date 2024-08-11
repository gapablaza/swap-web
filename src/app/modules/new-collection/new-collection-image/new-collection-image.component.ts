import { Component, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
  ImageCropperModule,
} from 'ngx-image-cropper';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NewCollectionService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-new-collection-image',
  templateUrl: './new-collection-image.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSliderModule,
    ImageCropperModule,
  ],
})
export class NewCollectionImageComponent {
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  imageSelected = false;
  isSaving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: 'proposed' | 'validated';
    },
    private dialogRef: MatDialogRef<NewCollectionImageComponent>,
    private newColSrv: NewCollectionService,
    private uiSrv: UIService
  ) {}

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

  onChangeScale(newScale: number) {
    this.scale = newScale ? newScale : 1;
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

    let sizeInMb =
      (4 *
        Math.ceil((newImage?.base64 || '').length / 3) *
        0.5624896334383812) /
      1000 /
      1000;
    if (sizeInMb > 6) {
      this.uiSrv.showError(
        'La imagen elegida es muy grande. Prueba con una de menor tamaño/resolución.'
      );
      this.isSaving = false;
      return;
    }

    this.croppedImage = newImage?.base64;

    if (this.data.type == 'proposed') {
      this.newColSrv
        .uploadImageToCloudinary(this.croppedImage as string)
        .subscribe({
          next: (res) => this.dialogRef.close(res),
          error: (err) => {
            console.log('uploadImageToCloudinary', err);
            this.isSaving = false;
          },
        });
    } else if (this.data.type == 'validated') {
      this.newColSrv.uploadImage(this.croppedImage as string).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => {
          console.log('uploadImageToCloudinary', err);
          this.isSaving = false;
        },
      });
    }
  }
}
