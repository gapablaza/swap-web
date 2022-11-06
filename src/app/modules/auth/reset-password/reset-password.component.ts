import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading = false;

  constructor(
    private authSrv: AuthService,
    private uiSrv: UIService,
  ) { }

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      })
    });
  }

  onSubmit(f: NgForm) {
    this.isLoading = true;
    this.authSrv.resetPassword(f.value.email)
    .pipe(take(1))
    .subscribe({
      next: (resp) => {
        this.uiSrv.showSuccess(resp);
      },
      error: (err) => {
        console.log('error', err);
        this.uiSrv.showError(err.message);
        this.isLoading = false;
      }
    })
  }
}
