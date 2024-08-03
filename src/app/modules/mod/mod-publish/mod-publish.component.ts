import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { modFeature } from '../store/mod.state';
import { modActions } from '../store/mod.actions';

@Component({
  selector: 'app-mod-publish',
  templateUrl: './mod-publish.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class ModPublishComponent implements OnInit {
  newCollections$ = this.store.select(modFeature.selectNewCollections);
  isLoaded$ = this.store.select(modFeature.selectIsPublishLoaded);
  isProcessing$ = this.store.select(modFeature.selectIsProcessing);

  @ViewChild('publishDialog') publishDialog!: TemplateRef<any>;
  publishForm = this.formBuilder.group({
    security: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
  });

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.store.dispatch(modActions.loadNewCollections());
  }

  onPublish(newCollectionId: number): void {
    this.dialog.open(this.publishDialog, {
      disableClose: true,
      maxWidth: '600px',
      data: {
        id: newCollectionId,
      },
    });
  }

  onConfirm(newCollectionId: number): void {
    if (this.publishForm.invalid) return;
    let security = this.publishForm.get('security')?.value || '';

    this.store.dispatch(
      modActions.publishNewCollection({ newCollectionId, security })
    );
  }
}
