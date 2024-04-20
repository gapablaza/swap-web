import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { concatMap, filter, Subscription, take, tap } from 'rxjs';
import orderBy from 'lodash/orderBy';

import {
  AuthService,
  DEFAULT_USER_PROFILE_IMG,
  Evaluation,
  SEOService,
  User,
  UserService,
} from 'src/app/core';
import { UserOnlyService } from '../user-only.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIService } from 'src/app/shared';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { ReportComponent } from 'src/app/shared/components/report/report.component';

@Component({
    selector: 'app-user-evaluations',
    templateUrl: './user-evaluations.component.html',
    styleUrls: ['./user-evaluations.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        UserSummaryComponent,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        NgClass,
        MatInputModule,
        FormsModule,
        NgFor,
        RouterLink,
        LazyLoadImageModule,
        ReactiveFormsModule,
        DatePipe,
    ],
})
export class UserEvaluationsComponent implements OnInit, OnDestroy {
  user: User = {} as User;
  isAuth = false;
  authUser = this.authSrv.getCurrentUser();
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  evaluations: Evaluation[] = [];
  showedEvaluations: Evaluation[] = [];

  disabled = true;
  disabledData: any;
  evaluationForm!: FormGroup;

  searchText = '';
  typeSelected = '0';

  showFilters = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
    private authSrv: AuthService,
    private formBuilder: FormBuilder,
    private SEOSrv: SEOService,
    private dialog: MatDialog,
    private uiSrv: UIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let userSub = this.userOnlySrv.user$
      .pipe(
        filter((user) => user.id != null),
        tap((user) => {
          this.SEOSrv.set({
            title: `Evaluaciones recibidas de ${user.displayName} (ID ${user.id}) - Intercambia Láminas`,
            description: `Revisa el detalle de las evaluaciones recibidas de ${user.displayName} (ID ${user.id}).`,
            isCanonical: true,
          });

          this.isSaving = false;
          this.isLoaded = false;
          this.user = user;
        }),
        concatMap((user) => this.userSrv.getEvaluations(user.id))
      )
      .subscribe((resp) => {
        this.evaluations = resp.evaluations.map((e) => {
          if (e.previousEvaluationsCounter) {
            let prevEvalArray = e.previousEvaluationsData?.sort((pa, pb) => {
              return pa.epochCreationTime < pb.epochCreationTime ? 1 : -1;
            });
            return { ...e, previousEvaluationsData: prevEvalArray };
          } else {
            return e;
          }
        });
        this.showedEvaluations = [...this.evaluations];
        this.sortShowedEvaluations();
        this.disabled = resp.disabled;
        this.disabledData = resp.disabledData;
        this.isLoaded = true;
        this.cdr.markForCheck();
      });
    this.subs.add(userSub);

    this.evaluationForm = this.formBuilder.group({
      type: ['', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(255)]],
    });

    let authSub = this.authSrv.isAuth.subscribe((authState) => {
      this.isAuth = authState;
    });
    this.subs.add(authSub);
  }

  get form() {
    return this.evaluationForm.controls;
  }

  onSubmit() {
    if (this.evaluationForm.invalid) {
      return;
    }

    this.isSaving = true;

    let userId = this.user.id;
    let typeId = +this.evaluationForm.value.type || 0;
    let commentText = this.evaluationForm.value.comment || '';

    this.userSrv
      .addEvaluation(userId, typeId, commentText)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.uiSrv.showSuccess('Evaluación registrada exitosamente');
          this.userOnlySrv.requestUserUpdate();
        },
        error: (error) => {
          console.log('addEvaluation error: ', error);
          this.uiSrv.showError(error.error.message);
          this.isSaving = false;
        },
      });
  }

  trackByEvaluation(index: number, item: Evaluation): number {
    return item.id;
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
