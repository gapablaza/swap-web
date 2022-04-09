import { Component, OnInit } from '@angular/core';
import { concatMap, map, of } from 'rxjs';
import { Evaluation, User, UserService } from 'src/app/core';
import { UserOnlyService } from '../user-only.service';

@Component({
  selector: 'app-user-evaluations',
  templateUrl: './user-evaluations.component.html',
  styleUrls: ['./user-evaluations.component.scss']
})
export class UserEvaluationsComponent implements OnInit {
  user: User = {} as User;
  evaluations: Evaluation[] = [];
  showedEvaluations: Evaluation[] = [];
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
        // console.log(evaluations);
        this.evaluations = evaluations
          .sort((a, b) => {
            return (a.epochCreationTime || 0) < (b.epochCreationTime || 0) ? 1 : -1;
          })
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
        if (this.user.id) {
          this.isLoaded = true;
        }
      });
    console.log('from UserEvaluationsComponent');
  }

  trackByEvaluation(index: number, item: Evaluation): number {
    return item.id;
  }
}
