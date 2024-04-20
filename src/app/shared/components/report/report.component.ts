import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { take } from 'rxjs';
import { ReportService, ReportType } from 'src/app/core';
import { UIService } from '../../ui.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    MatProgressSpinnerModule,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ReportComponent implements OnInit {
  title = 'Reportar';
  types: ReportType[] = [];
  objectTypeId = 0;
  objectId = 0;

  reportForm!: FormGroup;
  isSaving = false;
  isLoaded = false;

  constructor(
    private reportSrv: ReportService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private uiSrv: UIService,
    private dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.objectTypeId = data.objectTypeId;
    this.objectId = data.objectId;

    switch (this.objectTypeId) {
      case 7: {
          this.title = 'Reportar usuario';
          break;
      } 
      case 8: {
          this.title = 'Reportar evaluación';
          break;
      }
      default: {
          this.title = 'Reportar';
      }
  }
  }

  ngOnInit(): void {
    this.reportSrv
      .listTypes(this.objectTypeId)
      .pipe(take(1))
      .subscribe((types) => {
        this.types = types.sort((a, b) => a.sort - b.sort);

        this.isLoaded = true;
        this.cdr.markForCheck();
      });

    this.reportForm = this.formBuilder.group({
      type: ['', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  get form() {
    return this.reportForm.controls;
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      return;
    }

    this.isSaving = true;
    let typeId = +this.reportForm.value.type || 0;
    let commentText = this.reportForm.value.comment || '';

    this.reportSrv
      .add(this.objectTypeId, this.objectId, typeId, commentText)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.uiSrv.showSnackbar(
            'Gracias. Recibimos tu reporte para determinar si se han infringido nuestros lineamientos de la comunidad.',
            undefined,
            5000
          );
          this.dialogRef.close();
        },
        error: (error) => {
          console.log('add error: ', error);
          this.uiSrv.showError(error.error.message);
          this.isSaving = false;
        },
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
