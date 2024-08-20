import {
  DatePipe,
  DecimalPipe,
  NgClass,
  registerLocaleData,
} from '@angular/common';
import es from '@angular/common/locales/es';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { DEFAULT_USER_PROFILE_IMG, Evaluation, User } from 'src/app/core';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-evaluations-list',
  templateUrl: './user-evaluations-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    LazyLoadImageModule,

    PaginationComponent,
  ],
})
export class UserEvaluationsListComponent {
  authUser = input<User>({} as User);
  disabled = input<boolean>(true);
  evaluatedRecently = input<boolean>(false);
  evaluations = input.required<Evaluation[]>();

  managedEvaluations = computed(() => {
    const filterText = this.searchText();
    const type = parseInt(this.typeSelected());

    let filteredEvaluations = this.evaluations()
      // se filtra por el texto
      .filter((elem: Evaluation) => {
        return this.applyFilter(elem, filterText);
      })
      // se filtra por tipo
      .filter((elem: Evaluation) => {
        return type ? elem.evaluationTypeId == type : true;
      })
      // se ordena
      .sort((a: Evaluation, b: Evaluation) => {
        return b.epochCreationTime - a.epochCreationTime;
      });
    return filteredEvaluations;
  });

  showedEvaluations = computed(() => {
    const page = this.pageSelected();
    const startIndex = (page - 1) * this.recordsPerPage;
    const endIndex = page * this.recordsPerPage;

    return this.managedEvaluations().slice(startIndex, endIndex);
  });

  lastPage = computed(() => {
    if (this.managedEvaluations().length == 0) {
      return 1;
    }

    return Math.ceil(this.managedEvaluations().length / this.recordsPerPage);
  });

  fromRecord = computed(() => {
    const page = this.pageSelected();
    return Math.min(
      (page - 1) * this.recordsPerPage + 1,
      this.managedEvaluations().length
    );
  });

  toRecord = computed(() => {
    const page = this.pageSelected();
    const endRecord = page * this.recordsPerPage;
    return Math.min(endRecord, this.managedEvaluations().length);
  });

  typeSelected = signal('0');
  searchText = signal('');
  pageSelected = signal(1);

  showFilters = false;
  recordsPerPage = 25;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  @Output() onShowPreviousEvaluations = new EventEmitter<Evaluation[]>();
  @Output() onShowReportDialog = new EventEmitter<number>();
  @Output() onNavigateToForm = new EventEmitter<void>();

  applyFilter(evaluation: Evaluation, searchText: string): boolean {
    if (searchText.length <= 1) {
      return true;
    }
    return (
      evaluation.user.data.displayName
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      evaluation.user.data.id
        .toString()
        .indexOf(searchText.toLocaleLowerCase()) !== -1 ||
      evaluation.description
        .toLocaleLowerCase()
        .indexOf(searchText.toLocaleLowerCase()) !== -1
    );
  }

  onClearFilter() {
    this.searchText.set('');
  }

  onPageChange(page: number) {
    this.pageSelected.set(page);
  }

  showReportDialog(evaluationId: number) {
    this.onShowReportDialog.emit(evaluationId);
  }

  showPreviousEvaluations(previousEvaluations: Evaluation[]) {
    this.onShowPreviousEvaluations.emit(previousEvaluations);
  }

  constructor() {
    registerLocaleData(es);

    effect(
      () => {
        this.searchText();
        this.typeSelected();
        this.pageSelected.set(1);
      },
      { allowSignalWrites: true }
    );
  }
}
