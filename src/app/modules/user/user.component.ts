import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { userActions } from './store/user.actions';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: `@import './src/styles/pages/_user.scss';`,
  encapsulation: ViewEncapsulation.None,
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
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.store.dispatch(userActions.cleanUserData());
  }
}
