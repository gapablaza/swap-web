import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';

import { authFeature } from '../store/auth.state';
import { authActions } from '../store/auth.actions';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AsyncPipe,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ResetPasswordComponent {
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);
  resetForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor(private store: Store) {}

  onSubmit(f: NgForm) {
    this.store.dispatch(authActions.resetPassword({ email: f.value.email }));
  }
}
