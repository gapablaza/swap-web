import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { userActions } from './store/user.actions';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class UserComponent implements OnInit, OnDestroy {
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
