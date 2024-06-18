import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NgForm,
  Validators,
  FormGroup,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, from, Subscription, switchMap, take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  // GoogleLoginProvider,
  FacebookLoginProvider,
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { Store } from '@ngrx/store';

import { AuthService } from 'src/app/core';
import { SocialModule } from 'src/app/shared';
import { authActions } from '../store/auth.actions';
import { authFeature } from '../store/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf,
    AsyncPipe,

    SocialModule,
    GoogleSigninButtonModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  returnUrl = '/';
  isLoading = false;
  isLoading$ = this.store.select(authFeature.selectLoading);
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private socialSrv: SocialAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
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

    // let socialSub = this.socialSrv.authState
    //   .pipe(
    //     filter((user) => user != null && user.provider == 'GOOGLE'),
    //     switchMap((user) => this.authSrv.googleIdLogin(user.id))
    //   )
    //   .subscribe((resp) => {
    //     if (resp) {
    //       this.redirectOnLogin();
    //     }
    //   });
    // this.subs.add(socialSub);

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(f: NgForm) {
    this.store.dispatch(authActions.loginWithEmail({
      email: f.value.email,
      password: f.value.password,
    }));
  }

  signInWithFB(): void {
    this.isLoading = true;

    from(this.socialSrv.signIn(FacebookLoginProvider.PROVIDER_ID))
      .pipe(
        take(1),
        filter((user) => user != null),
        switchMap((user) => this.authSrv.facebookIdLogin(user.id))
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
