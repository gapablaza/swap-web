import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

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
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(''),
    repeatedPassword: new FormControl(''),
  });
  isLoading = false;

  constructor(
    private authSrv: AuthService,
    private uiSrv: UIService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        repeatedPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'repeatedPassword')],
      }
    );

    let actualParams = this.route.snapshot.queryParams;
    if (
      !actualParams.hasOwnProperty('userId') ||
      !actualParams.hasOwnProperty('hash')
    ) {
      this.uiSrv.showError(
        'Por favor, vuelve a realizar la solicitud de reseteo de contraseña nuevamente'
      );
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.newPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authSrv
      .setNewPassword(
        this.newPasswordForm.controls['password'].value,
        this.route.snapshot.queryParams['userId'],
        this.route.snapshot.queryParams['hash']
      )
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.uiSrv.showSuccess(resp);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
          this.uiSrv.showError(err.message);
          this.isLoading = false;
        },
      });
  }
}
