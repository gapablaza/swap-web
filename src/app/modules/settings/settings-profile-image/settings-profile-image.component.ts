import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
  ImageCropperModule,
} from 'ngx-image-cropper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { authFeature } from '../../auth/store/auth.state';
import { authActions } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-settings-profile-image',
  templateUrl: './settings-profile-image.component.html',
  standalone: true,
  imports: [
    AsyncPipe,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSliderModule,

    ImageCropperModule,
  ],
})
export class SettingsProfileImageComponent implements OnInit {
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  imageSelected = false;

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<SettingsProfileImageComponent>
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
    this.dialogRef.close();
  }

  onSaveImage() {
    const newAvatar = this.cropper.crop();
    this.croppedImage = newAvatar?.base64;
    this.store.dispatch(
      authActions.updateAvatar({ image64: this.croppedImage as string })
    );
  }
}
