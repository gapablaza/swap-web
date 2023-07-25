import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';
import { NewCollectionService, Publisher } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { NewCollectionImageComponent } from '../new-collection-image/new-collection-image.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-collection-add',
  templateUrl: './new-collection-add.component.html',
  styleUrls: ['./new-collection-add.component.scss'],
})
export class NewCollectionAddComponent implements OnInit, OnDestroy {
  publishers: Publisher[] = [];
  file?: File;
  fileName = '';
  preview = '';
  newCollectionForm!: FormGroup;
  selectedYear: number;
  years: number[] = [];
  isSaving = false;
  isLoaded = true;
  subs: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private newColSrv: NewCollectionService,
    private uiSrv: UIService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 1940; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.newCollectionForm = this.formBuilder.group({
      name: ['Título de prueba', Validators.required],
      year: ['2021', Validators.required],
      publisher: ['1', Validators.required],
      description: ['Descripción de prueba', Validators.maxLength(1000)],
      numbers: ['Numeración de prueba', Validators.maxLength(250)],
      cover: [10, Validators.required],
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
  }

  get form() {
    return this.newCollectionForm.controls;
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   // const file = (event.target as HTMLInputElement).files[0];

  //   if (file) {
  //     this.file = file;
  //     this.fileName = file.name;
  //     console.log(file);
  //     this.newCollectionForm.patchValue({
  //       cover: file,
  //     });
  //     this.newCollectionForm.get('cover')?.updateValueAndValidity();

  //     // File preview
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.preview = reader.result as string;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // onUpload() {
  //   console.log('upload image');

  //   // this.isSaving = true;
  //   // this.newColSrv.uploadImage(this.file as File)
  //   //   .pipe(take(1))
  //   //   .subscribe({
  //   //     next: (newId) => {
  //   //       console.log(newId);
  //   //       this.isSaving = false;
  //   //     },
  //   //     error: (error) => {
  //   //       console.log('delete error: ', error);
  //   //       this.uiSrv.showError(error.error.message);
  //   //       this.isSaving = false;
  //   //     },
  //   //   })
  // }

  onNewImage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['std-image-uploader'];
    dialogConfig.width = '375px';
    // dialogConfig.maxWidth = '500px';

    let dialogRef = this.dialog.open(NewCollectionImageComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.id) {
        this.newCollectionForm.patchValue({
          cover: res.id,
        });
        this.newCollectionForm.get('cover')?.updateValueAndValidity();
        this.preview = res.base64;
      } 
    });
  }

  onRemoveImage() {
    this.newCollectionForm.patchValue({
      cover: null,
    });
    this.newCollectionForm.get('cover')?.updateValueAndValidity();
    this.preview = '';
  }

  onSubmit() {
    console.log(this.newCollectionForm.value);
    // this.router.navigate(['new-collection/', 1]); return;

    if (this.newCollectionForm.invalid) {
      return;
    }

    this.isSaving = true;
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
