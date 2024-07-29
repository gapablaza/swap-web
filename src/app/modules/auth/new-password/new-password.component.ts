import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { UIService } from 'src/app/shared';
import { authFeature } from '../store/auth.state';
import { authActions } from '../store/auth.actions';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
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
export class NewPasswordComponent implements OnInit {
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);
  actualParams = this.route.snapshot.queryParams;
  newPasswordForm = new FormGroup(
    {
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      }),
      repeatedPassword: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    Validators.compose([Validation.match('password', 'repeatedPassword')])
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    if (
      !this.actualParams.hasOwnProperty('userId') ||
      !this.actualParams.hasOwnProperty('hash')
    ) {
      this.uiSrv.showError(
        'Por favor, realiza la solicitud de reseteo de contraseña nuevamente'
      );
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(f: NgForm) {
    this.store.dispatch(
      authActions.newPassword({
        newPassword: f.value.password,
        userId: this.actualParams['userId'],
        hash: this.actualParams['hash'],
      })
    );
  }
}
