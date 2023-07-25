import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService, User } from 'src/app/core';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss']
})
export class NewCollectionComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;

  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();
    console.log(this.authUser);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
