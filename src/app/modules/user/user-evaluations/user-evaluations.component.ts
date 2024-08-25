import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgClass, DatePipe, AsyncPipe } from '@angular/common';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { Evaluation, SEOService } from 'src/app/core';
import { authFeature } from '../../auth/store/auth.state';
import { userFeature } from '../store/user.state';
import { userActions } from '../store/user.actions';
import { ReportComponent } from 'src/app/shared/components/report/report.component';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { UserEvaluationsPreviousComponent } from './user-evaluations-previous.component';
import { UserEvaluationsListComponent } from './user-evaluations-list.component';

@Component({
  selector: 'app-user-evaluations',
  templateUrl: './user-evaluations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    RouterLink,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    UserSummaryComponent,
    UserEvaluationsListComponent,
  ],
})
export class UserEvaluationsComponent implements OnInit, OnDestroy {
  user$ = this.store.select(userFeature.selectUser);
  isAuth$ = this.store.select(authFeature.selectIsAuth);

  authUser = this.store.selectSignal(authFeature.selectUser);
  evaluations = this.store.selectSignal(userFeature.selectEvaluations);
  evaluatedRecently = this.store.selectSignal(userFeature.selectEvaluatedRecently);
  disabled = this.store.selectSignal(userFeature.selectEvalutionsDisabled);
  disabledData = this.store.selectSignal(
    userFeature.selectEvaluationsDisabledData
  );

  disabledForAntiquity = computed(() => {
    if (this.disabled() && this.disabledData()?.disabledForAntiquity) {
      return Number(this.disabledData()?.disabledForAntiquity);
    } else {
      return 0;
    }
  });
  disabledForTime = computed(() => {
    if (this.disabled() && this.disabledData()?.disabledForTime) {
      return Number(this.disabledData()?.disabledForTime);
    } else {
      return 0;
    }
  });

  evaluationForm = this.formBuilder.group({
    type: ['', Validators.required],
    comment: ['', [Validators.required, Validators.maxLength(255)]],
  });

  isProcessing$ = this.store.select(userFeature.selectIsProcessing);
  isLoaded$ = this.store.select(userFeature.selectIsEvaluationsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(userActions.loadUserEvaluations());

    let evalSub = this.user$
      .pipe(
        tap((user) => {
          this.SEOSrv.set({
            title: `Evaluaciones recibidas de ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de las evaluaciones recibidas de ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
    this.subs.add(evalSub);
  }

  get form() {
    return this.evaluationForm.controls;
  }

  onSubmit() {
    if (this.evaluationForm.invalid) {
      return;
    }

    let typeId = this.evaluationForm.value.type
      ? +this.evaluationForm.value.type
      : 0;
    let commentText = this.evaluationForm.value.comment || '';

    this.store.dispatch(
      userActions.addEvaluation({ typeId, comment: commentText })
    );
  }

  onNavigateToForm() {
    let x = document.querySelector('#evaluation');
    if (x) {
      x.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onShowReportDialog(id: number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['report-dialog'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';

    dialogConfig.data = {
      objectTypeId: 8,
      objectId: id,
    };

    this.dialog.open(ReportComponent, dialogConfig);
  }

  onShowPreviousEvaluations(previousEvaluations: Evaluation[]) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = ['previous-evaluations-dialog'];
    dialogConfig.width = '80%';
    dialogConfig.maxWidth = '1280px';

    dialogConfig.data = {
      evaluations: previousEvaluations,
    };

    this.dialog.open(UserEvaluationsPreviousComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
