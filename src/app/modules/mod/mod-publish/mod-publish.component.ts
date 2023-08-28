import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { NewCollection, NewCollectionService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-mod-publish',
  templateUrl: './mod-publish.component.html',
  styleUrls: ['./mod-publish.component.scss']
})
export class ModPublishComponent implements OnInit {
  @ViewChild('publishDialog') publishDialog!: TemplateRef<any>;
  newCollections: NewCollection[] = [];
  publishForm!: FormGroup;

  isSaving = false;
  isLoaded = false;

  constructor(
    private newColSrv: NewCollectionService,
    private uiSrv: UIService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.newColSrv
      .list({
        query: '',
        status: 4,
        sortBy: 'votes'
      })
      .pipe(take(1))
      .subscribe((resp) => {
        this.newCollections = resp.newCollections;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });

      this.publishForm = this.formBuilder.group({
        security: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100),
          ],
        ],
      });
  }

  onPublish(newCollectionId: number): void {
    this.dialog.open(this.publishDialog, { 
      disableClose: true,
      maxWidth: '600px',
      data: {
        id: newCollectionId
      }
    });
  }

  onConfirm(newCollectionId: number): void {
    if (this.publishForm.invalid) return;

    this.isSaving = true;
    let security = this.publishForm.get('security')?.value || '';

    this.newColSrv.publish(newCollectionId, security)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.newCollections.splice(
            this.newCollections.findIndex((elem) => {
              return elem.id == newCollectionId;
            }),
            1
          );
          this.uiSrv.showSuccess(resp.message);
          this.isSaving = false;
          this.cdr.detectChanges();
          this.dialog.closeAll();
        }, 
        error: (error) => {
          console.log('onConfirm error: ', error);
          this.isSaving = false;
          this.cdr.detectChanges();
          this.dialog.closeAll();
        }
      });
  }
}
