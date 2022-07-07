import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { ImageCroppedEvent, LoadedImage, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-settings-profile-image',
  templateUrl: './settings-profile-image.component.html',
  styleUrls: ['./settings-profile-image.component.scss'],
})
export class SettingsProfileImageComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  imageSelected = false;

  constructor(private dialogRef: MatDialogRef<SettingsProfileImageComponent>) {}

  ngOnInit(): void {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageSelected = true;
  }

  // imageLoaded(image: LoadedImage) {
  imageLoaded() {
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
        scale: this.scale
    };
  }

  onChangeScale(event: MatSliderChange) {
    this.scale = event.value ? event.value : 1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  onFullZoomIn() {
    this.scale = 5;
    this.transform = {
        ...this.transform,
        scale: this.scale
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
    this.dialogRef.close();
  }
}
