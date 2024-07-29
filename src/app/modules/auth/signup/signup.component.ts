import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import { authFeature } from '../store/auth.state';
import { authActions } from '../store/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AsyncPipe,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    GoogleSigninButtonModule,
  ],
})
export class SignupComponent implements OnInit, OnDestroy {
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);
  signupForm = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ],
    }),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.signupPageOpened());
  }

  onSubmit(f: NgForm) {
    this.store.dispatch(authActions.signupEmail(f.value));
  }

  ngOnDestroy(): void {
    this.store.dispatch(authActions.signupPageDestroyed());
  }
}
