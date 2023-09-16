import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService, User } from 'src/app/core';

@Component({
    selector: 'app-new-collection',
    templateUrl: './new-collection.component.html',
    styleUrls: ['./new-collection.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class NewCollectionComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;

  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();

    if (this.authUser.disabled) {
      this.router.navigate(['']);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
