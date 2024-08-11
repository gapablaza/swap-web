import { Component, computed, effect, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { NewCollection } from 'src/app/core';
import { NewCollectionImageComponent } from '../new-collection-image/new-collection-image.component';
import { authFeature } from '../../auth/store/auth.state';
import { newCollectionFeature } from '../store/new-collection.state';
import { newCollectionActions } from '../store/new-collection.actions';

@Component({
  selector: 'app-new-collection-add',
  templateUrl: './new-collection-add.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
})
export class NewCollectionAddComponent implements OnInit, OnDestroy {
  authUser = this.store.selectSignal(authFeature.selectUser);
  newCollection = this.store.selectSignal(
    newCollectionFeature.selectNewCollection
  );
  publishers = this.store.selectSignal(
    newCollectionFeature.selectPublishersOrdered
  );
  canUpdate = this.store.selectSignal(newCollectionFeature.selectCanUpdate);
  canAddOrUpdate = computed(() => {
    if (this.newColId) {
      return this.canUpdate();
    } else {
      return this.authUser().daysSinceRegistration >= 30;
    }
  });

  isLoaded = this.store.selectSignal(
    newCollectionFeature.selectIsAddOrEditLoaded
  );
  isProcessing = this.store.selectSignal(
    newCollectionFeature.selectIsProcessing
  );

  title = 'Nueva solicitud';
  preview = '';
  coverPreview = '';
  newColId?: string;
  newCollectionForm!: FormGroup;
  selectedYear: number;
  selectedPublisher!: number;
  years: number[] = [];

  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 1940; year--) {
      this.years.push(year);
    }

    effect(() => {
      if (this.newColId && this.newCollection() !== null) {
        this.updateForm(this.newCollection()!);
      }
    });
  }

  ngOnInit(): void {
    this.newColId = this.route.snapshot.params['id'];
    this.store.dispatch(
      newCollectionActions.loadAddOrEdit({
        collectionId: this.route.snapshot.params['id'],
      })
    );

    this.newCollectionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      year: [this.selectedYear, Validators.required],
      released: [
        `${this.selectedYear}-01-01`,
        [
          ...(this.authUser().isMod
            ? [
                Validators.required,
                Validators.pattern(
                  /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
                ),
              ]
            : []),
        ],
      ],
      publisher: [null, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      details: ['', Validators.maxLength(1000)],
      numbers: ['', Validators.maxLength(250)],
      image: [null, Validators.required],
      cover: [],
    });
  }

  updateForm(newCollection: NewCollection) {
    this.newCollectionForm.patchValue({
      name: newCollection.name,
      year: newCollection.year,
      released: newCollection.released?.substring(0, 10) || null,
      publisher: newCollection.publisher.data.id,
      description: newCollection.description,
      details: newCollection.details || null,
      numbers: newCollection.checklistDescription || null,
      image: newCollection.image.data?.id || null,
      cover: newCollection.cover?.data?.id || null,
    });
    this.preview =
      newCollection.image.data?.base64 || newCollection.image.data?.url || '';
    this.coverPreview =
      newCollection.cover?.data?.base64 || newCollection.cover?.data?.url || '';
    this.selectedPublisher = newCollection.publisher.data.id || 0;
    this.title = `Editar solicitud de colección ID ${newCollection.id}`;
  }

  get form() {
    return this.newCollectionForm.controls;
  }

  onNewImage(type: string) {
    if (type !== 'proposed' && type !== 'validated') {
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['std-image-uploader'];
    dialogConfig.width = '375px';
    // dialogConfig.maxWidth = '500px';
    dialogConfig.data = {
      type: type,
    };

    let dialogRef = this.dialog.open(NewCollectionImageComponent, dialogConfig);
    let dialogSub = dialogRef.afterClosed().subscribe((res) => {
      if (res && res.id) {
        if (type == 'proposed') {
          this.newCollectionForm.patchValue({
            image: res.id,
          });
          this.newCollectionForm.get('image')?.updateValueAndValidity();
          // this.preview = res.base64;
          this.preview = res.url;
        } else if (type == 'validated') {
          this.newCollectionForm.patchValue({
            cover: res.id,
          });
          this.newCollectionForm.get('cover')?.updateValueAndValidity();
          this.coverPreview = res.base64;
        }
      }
    });
    this.subs.add(dialogSub);
  }

  onRemoveImage(type: string) {
    if (type !== 'proposed' && type !== 'validated') {
      return;
    }

    if (type == 'proposed') {
      this.newCollectionForm.patchValue({
        image: null,
      });
      this.newCollectionForm.get('image')?.updateValueAndValidity();
      this.preview = '';
    } else if (type == 'validated') {
      this.newCollectionForm.patchValue({
        cover: null,
      });
      this.newCollectionForm.get('cover')?.updateValueAndValidity();
      this.coverPreview = '';
    }
  }

  onSubmit() {
    if (this.newCollectionForm.invalid) {
      return;
    }

    if (this.newColId) {
      this.store.dispatch(
        newCollectionActions.updateNewCollection({
          newCollectionForm: this.newCollectionForm.value,
        })
      );
    } else {
      this.store.dispatch(
        newCollectionActions.addNewCollection({
          newCollectionForm: this.newCollectionForm.value,
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
