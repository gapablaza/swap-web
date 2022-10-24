import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { AuthService, User } from 'src/app/core';

@Component({
  selector: 'app-collaborate',
  templateUrl: './collaborate.component.html',
  styleUrls: ['./collaborate.component.scss'],
})
export class CollaborateComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    let authSub = this.authSrv.authUser
      .pipe(filter((user) => user.id != null))
      .subscribe((user) => {
        this.authUser = user;
        this.isLoaded = true;
      });
    this.subs.add(authSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
