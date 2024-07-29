import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NgForm,
  Validators,
  FormGroup,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Store } from '@ngrx/store';

import { authActions } from '../store/auth.actions';
import { authFeature } from '../store/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AsyncPipe,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    GoogleSigninButtonModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);
  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.loginPageOpened());
  }

  onSubmit(f: NgForm) {
    this.store.dispatch(
      authActions.loginWithEmail({
        email: f.value.email,
        password: f.value.password,
      })
    );
  }

  signInWithFB(): void {
    this.store.dispatch(authActions.loginFacebook());
  }

  ngOnDestroy(): void {
    this.store.dispatch(authActions.loginPageDestroyed());
  }
}
