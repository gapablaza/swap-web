import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { NewCollectionService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-new-collection-image',
  templateUrl: './new-collection-image.component.html',
  styleUrls: ['./new-collection-image.component.scss']
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
    this.croppedImage = newImage?.base64;

    this.newColSrv.uploadImage(this.croppedImage as string).subscribe((res) => {
      if (res) {
        // this.uiSrv.showSuccess('Imagen subida con éxito');
        this.dialogRef.close(res);
      } else {
        this.uiSrv.showError('No se pudo subir la imagen');
        this.isSaving = false;
      }
    });
  }
}
