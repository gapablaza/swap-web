import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, first, Subscription, switchMap, tap } from 'rxjs';

import { AuthService } from 'src/app/core';
import { UIService } from 'src/app/shared';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;
  isLoading = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private socialSrv: SocialAuthService,
    private uiSrv: UIService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
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

    let socialSub = this.socialSrv.authState
      .pipe(
        filter((user) => user != null && user.provider == 'GOOGLE'),
        switchMap((user) =>
          this.authSrv.googleSignup({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.photoUrl,
          })
        )
      )
      .subscribe((resp) => {
        console.log(resp);
        if (resp) {
          this.uiSrv.showSuccess('Cuenta creada exitosamente');
          this.router.navigate(['/']);
        }
      });
    this.subs.add(socialSub);
  }

  onSubmit(f: NgForm) {
    this.isLoading = true;

    this.authSrv
      .emailSignup(f.value.name, f.value.email, f.value.password)
      .pipe(first())
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.uiSrv.showSuccess('Cuenta creada exitosamente');
            this.router.navigate(['/']);
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);

          let errorMsg = 'No se pudo crear la cuenta';
          if (err.message) {
            errorMsg += ': ';
            for (var prop in err.message) {
              if (Object.prototype.hasOwnProperty.call(err.message, prop)) {
                errorMsg += '- ' + (err.message[prop] as []).join(' -') + '. ';
              }
            }
            this.uiSrv.showError(errorMsg);
          }
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
