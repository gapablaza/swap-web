import { Component, OnInit } from '@angular/core';
import { concatMap, map, of } from 'rxjs';
import { orderBy } from 'lodash';

import { DEFAULT_USER_PROFILE_IMG, Evaluation, User, UserService } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';

@Component({
  selector: 'app-user-evaluations',
  templateUrl: './user-evaluations.component.html',
  styleUrls: ['./user-evaluations.component.scss']
})
export class UserEvaluationsComponent implements OnInit {
  user: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  evaluations: Evaluation[] = [];
  showedEvaluations: Evaluation[] = [];

  searchText = '';
  typeSelected = "0";
  
  showFilters = false;
  isLoaded = false;

  constructor(
    private userSrv: UserService,
    private userOnlySrv: UserOnlyService,
  ) { }

  ngOnInit(): void {
    this.userOnlySrv.user$
      .pipe(
        concatMap(user => {
          if (user.id) {
            this.user = user;
            return this.userSrv.getEvaluations(user.id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe(evaluations => {
        this.evaluations = evaluations
          .map(e => {
            if (e.previousEvaluationsCounter) {
              let prevEvalArray = e.previousEvaluationsData?.sort((pa, pb) => {
                return (pa.epochCreationTime) < (pb.epochCreationTime) ? 1 : -1;
              })
              return { ...e, previousEvaluationsData: prevEvalArray };
            } else {
              return e;
            }
          });
        this.showedEvaluations = [...this.evaluations];
        this.sortShowedEvaluations();
        if (this.user.id) {
          this.isLoaded = true;
        }
      });
    console.log('from UserEvaluationsComponent');
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
            elem.user.data.id.toString().indexOf(this.searchText.toLocaleLowerCase()) !==
              -1
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
}
