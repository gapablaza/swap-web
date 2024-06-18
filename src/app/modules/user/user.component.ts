import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { UserOnlyService } from './user-only.service';
import { userActions } from './store/user.actions';
import { Subscription, map } from 'rxjs';
import { userFeature } from './store/user.state';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserOnlyService],
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
})
export class UserComponent implements OnInit, OnDestroy {
  isLoaded$ = this.store.select(userFeature.selectIsLoaded);
  subs: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    let routeSub = this.route.paramMap.pipe(
      map(params => {
        let userId = params.get('id');
        return +(userId || 0);
      })
    )
    .subscribe(userId => {
      this.store.dispatch(userActions.loadUserData({ userId }));
    });
    this.subs.add(routeSub);
    // TO DO: Manejar el caso cuando no se encuentre el usuario solicitado
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(userActions.cleanUserData());
  }
}
