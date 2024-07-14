import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, map, Subscription, tap } from 'rxjs';
import orderBy from 'lodash-es/orderBy';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
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

import { DEFAULT_USER_PROFILE_IMG, Evaluation, SEOService } from 'src/app/core';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { ReportComponent } from 'src/app/shared/components/report/report.component';
import { authFeature } from '../../auth/store/auth.state';
import { userFeature } from '../store/user.state';
import { userActions } from '../store/user.actions';

@Component({
  selector: 'app-user-evaluations',
  templateUrl: './user-evaluations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    UserSummaryComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatInputModule,
    NgClass,
    FormsModule,
    RouterLink,
    LazyLoadImageModule,
    ReactiveFormsModule,
    DatePipe,
    AsyncPipe,
  ],
})
export class UserEvaluationsComponent implements OnInit, OnDestroy {
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  isAuth$ = this.store.select(authFeature.selectIsAuth);
  authUser$ = this.store.select(authFeature.selectUser);
  user$ = this.store.select(userFeature.selectUser);

  evaluations: Evaluation[] = [];
  showedEvaluations: Evaluation[] = [];
  disabled = true;
  disabledData: any;

  evaluationForm!: FormGroup;
  searchText = '';
  typeSelected = '0';
  showFilters = false;

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

    let evalSub = combineLatest([
      this.user$,
      this.store.select(userFeature.selectEvaluationsData),
    ])
      .pipe(
        tap(([user]) => {
          this.SEOSrv.set({
            title: `Evaluaciones recibidas de ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de las evaluaciones recibidas de ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });
        }),
        map(([, evaluationsData]) => evaluationsData)
      )
      .subscribe((evaluationsData) => {
        if (evaluationsData?.evaluations.length) {
          this.evaluations = evaluationsData?.evaluations.map((e) => {
            if (e.previousEvaluationsCounter) {
              let prevEvalArray = [...(e.previousEvaluationsData || [])].sort(
                (pa, pb) => {
                  return pa.epochCreationTime < pb.epochCreationTime ? 1 : -1;
                }
              );
              return { ...e, previousEvaluationsData: prevEvalArray };
            } else {
              return e;
            }
          });
        }
        this.showedEvaluations = [...this.evaluations];
        this.sortShowedEvaluations();
        if (evaluationsData) {
          this.disabled = evaluationsData?.disabled;
        }
        this.disabledData = evaluationsData?.disabledData;
        this.cdr.markForCheck();
      });
    this.subs.add(evalSub);

    this.evaluationForm = this.formBuilder.group({
      type: ['', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  get form() {
    return this.evaluationForm.controls;
  }

  onSubmit() {
    if (this.evaluationForm.invalid) {
      return;
    }

    let typeId = +this.evaluationForm.value.type || 0;
    let commentText = this.evaluationForm.value.comment || '';

    this.store.dispatch(
      userActions.addEvaluation({ typeId, comment: commentText })
    );
  }

  onFilter() {
    this.filterShowedEvaluations();
  }

  onClearFilter() {
    this.searchText = '';
    this.filterShowedEvaluations();
  }

  onTypeFilter() {
    this.onFilter();
  }

  sortShowedEvaluations() {
    this.showedEvaluations = orderBy(
      [...this.showedEvaluations],
      ['creationTime'],
      ['desc']
    );
  }

  filterShowedEvaluations() {
    let tempEvaluations = this.evaluations;
    let type = parseInt(this.typeSelected);
    // 1.- check filter by text
    // check at least 2 chars for search
    if (this.searchText.length > 1) {
      tempEvaluations = [
        ...this.evaluations.filter((elem: Evaluation) => {
          return (
            elem.description
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.user.data.displayName
              .toLocaleLowerCase()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1 ||
            elem.user.data.id
              .toString()
              .indexOf(this.searchText.toLocaleLowerCase()) !== -1
          );
        }),
      ];
    }

    // 2.- check filter by evaluation type
    if (type) {
      tempEvaluations = [
        ...tempEvaluations.filter((elem) => {
          return elem.evaluationTypeId == type;
        }),
      ];
    }

    this.showedEvaluations = [...tempEvaluations];
    // 3.- sorting
    this.sortShowedEvaluations();
  }

  navigateToForm() {
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
