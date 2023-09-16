import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';

import {
  AuthService,
  NewCollectionService,
  Publisher,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { NewCollectionImageComponent } from '../new-collection-image/new-collection-image.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-new-collection-add',
    templateUrl: './new-collection-add.component.html',
    styleUrls: ['./new-collection-add.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        NgFor,
        MatOptionModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
    ],
})
export class NewCollectionAddComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  publishers: Publisher[] = [];

  title = 'Nueva solicitud';
  preview = '';
  coverPreview = '';

  newColId?: string;

  newCollectionForm!: FormGroup;
  selectedYear: number;
  selectedPublisher!: number;
  years: number[] = [];

  canAddOrUpdate = false;

  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private newColSrv: NewCollectionService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 1940; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();
    this.newColId = this.route.snapshot.params['id'];

    this.newCollectionForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.maxLength(100)],
      ],
      year: [this.selectedYear, Validators.required],
      released: [
        `${this.selectedYear}-01-01`,
        [
          ...(this.authUser.isMod
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
      description: [
        '',
        [Validators.required, Validators.maxLength(1000)],
      ],
      details: ['', Validators.maxLength(1000)],
      numbers: ['', Validators.maxLength(250)],
      image: [null, Validators.required],
      cover: [],
    });

    let pubsSub = this.newColSrv
      .getPublishers()
      .pipe(take(1))
      .subscribe((pubs) => {
        this.publishers = pubs.sort((a, b) => {
          return (a.name || '').toLocaleLowerCase() >
            (b.name || '').toLocaleLowerCase()
            ? 1
            : -1;
        });
      });
    this.subs.add(pubsSub);

    // Estamos en modo edición
    if (this.newColId) {
      this.title = `Editar solicitud de colección ID ${this.newColId}`;

      let newColSub = this.newColSrv
        .get(Number(this.newColId))
        .pipe(take(1))
        .subscribe((resp) => {
          this.newCollectionForm.patchValue({
            name: resp.newCollection.name,
            year: resp.newCollection.year,
            released: resp.newCollection.released?.substring(0, 10) || null,
            publisher: resp.newCollection.publisher.data.id,
            description: resp.newCollection.description,
            details: resp.newCollection.details || null,
            numbers: resp.newCollection.checklistDescription || null,
            image: resp.newCollection.image.data?.id || null,
            cover: resp.newCollection.cover?.data?.id || null,
          });
          this.preview = resp.newCollection.image.data?.base64 || resp.newCollection.image.data?.url || '';
          this.coverPreview = resp.newCollection.cover?.data?.base64 || resp.newCollection.cover?.data?.url || '';
          this.selectedPublisher = resp.newCollection.publisher.data.id;

          // Define si puede modificar la solicitud
          this.canAddOrUpdate =
            ([1, 2].includes(resp.newCollection.statusId) &&
              this.authUser.isMod) ||
            (resp.newCollection.statusId == 2 &&
              this.authUser.id == resp.newCollection.user.data?.id) ||
            ([1, 2, 3, 4].includes(resp.newCollection.statusId) &&
              this.authUser.id == 1);

          this.isLoaded = true;
        });
      this.subs.add(newColSub);
    }
    // Estamos en modo registro
    else {
      this.canAddOrUpdate = this.authUser.daysSinceRegistration >= 30;
      this.isLoaded = true;
    }
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

    this.isSaving = true;

    if (this.newColId) {
      this.newColSrv
        .update({
          ...this.newCollectionForm.value,
          id: Number(this.newColId),
        })
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            this.uiSrv.showSuccess(resp);
            this.router.navigate(['new-collection/', this.newColId]);
          },
          error: (error) => {
            console.log('update error: ', error);
            this.isSaving = false;
          },
        });
    } else {
      this.newColSrv
        .add(this.newCollectionForm.value)
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            this.uiSrv.showSuccess(resp.message);
            this.router.navigate(['new-collection/', resp.newId]);
          },
          error: (error) => {
            console.log('add error: ', error);
            this.isSaving = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
