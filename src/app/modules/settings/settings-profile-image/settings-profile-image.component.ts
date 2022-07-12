import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
} from 'ngx-image-cropper';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-settings-profile-image',
  templateUrl: './settings-profile-image.component.html',
  styleUrls: ['./settings-profile-image.component.scss'],
})
export class SettingsProfileImageComponent implements OnInit {
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  imageSelected = false;
  isSaving = false;

  constructor(
    private dialogRef: MatDialogRef<SettingsProfileImageComponent>,
    private authSrv: AuthService,
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
    const newAvatar = this.cropper.crop();
    this.croppedImage = newAvatar?.base64;

    this.authSrv.updateAvatar(this.croppedImage as string).subscribe((res) => {
      if (res) {
        this.uiSrv.showSuccess('Imagen cambiada con éxito');
        this.dialogRef.close();
      } else {
        this.uiSrv.showError('No se pudo registrar la imagen');
        this.isSaving = false;
      }
    });
  }
}
