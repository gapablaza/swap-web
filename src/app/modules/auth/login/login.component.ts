import { Component, OnInit } from '@angular/core';
import { NgForm, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

import { AuthService } from 'src/app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl = '/';
  isLoading = false;

  constructor(
    private authSrv: AuthService,
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

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(f: NgForm) {
    this.isLoading = true;

    this.authSrv
      .emailLogin(f.value.email, f.value.password)
      .pipe(first())
      .subscribe({
        next: (resp) => {
          if (resp) {
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
              queryParams: search
            });
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
}
