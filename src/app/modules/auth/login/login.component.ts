import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, from, Subscription, switchMap, take } from 'rxjs';

import {
  // GoogleLoginProvider,
  FacebookLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';

import { AuthService } from 'src/app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  returnUrl = '/';
  isLoading = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private socialSrv: SocialAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    let socialSub = this.socialSrv.authState
      .pipe(
        filter((user) => (user != null) && (user.provider == 'GOOGLE')),
        switchMap((user) => this.authSrv.googleIdLogin(user.id))
      )
      .subscribe((resp) => {
        if (resp) {
          this.redirectOnLogin();
        }
      });
    this.subs.add(socialSub);

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(f: NgForm) {
    this.isLoading = true;

    this.authSrv
      .emailLogin(f.value.email, f.value.password)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.redirectOnLogin();
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  signInWithFB(): void {
    this.isLoading = true;

    from(this.socialSrv.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(
        take(1),
        filter(user => user != null),
        switchMap(user => this.authSrv.facebookIdLogin(user.id))
      )
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.redirectOnLogin();
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  // refreshGoogleToken(): void {
  //   this.socialSrv.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }

  redirectOnLogin() {
    const path = this.returnUrl.split('?')[0];
    let search = {};

    if (this.returnUrl.includes('?')) {
      const searchString = this.returnUrl.split('?')[1];
      search = JSON.parse(
        '{"' +
          searchString
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
    }

    // this.router.navigate([this.returnUrl]);
    this.router.navigate([path], {
      queryParams: search,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
