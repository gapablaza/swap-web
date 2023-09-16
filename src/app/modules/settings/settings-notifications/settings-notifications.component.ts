import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, take } from 'rxjs';

import { AuthService, User, UserService } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SettingsOnlyService } from '../settings-only.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-settings-notifications',
    templateUrl: './settings-notifications.component.html',
    styleUrls: ['./settings-notifications.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class SettingsNotificationsComponent implements OnInit {
  emailForm!: FormGroup;
  authUser: User = {} as User;
  isSaving = false;
  isUpdating = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private authSrv: AuthService,
    private userSrv: UserService,
    private setOnlySrv: SettingsOnlyService,
    private formBuilder: FormBuilder,
    private uiSrv: UIService
  ) {}

  ngOnInit(): void {
    console.log('SettingsNotificationsComponent');

    this.setOnlySrv.setTitles({
      title: 'Notificaciones',
      subtitle: 'Recibe información directo a tu email',
    });

    let authSub = this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;

      this.emailForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
      });

      this.isLoaded = true;
    });
    this.subs.add(authSub);
  }

  onChange(e: any) {
    this.isSaving = true;
    this.authSrv
      .updateNotifications(e.checked)
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.uiSrv.showSuccess('Configuración actualizada exitosamente');
        } else {
          this.uiSrv.showError(
            'No se pudo actualizar tu configuración. Intenta nuevamente mas tarde por favor.'
          );
        }
        this.isSaving = false;
      });
  }

  get form() {
    return this.emailForm.controls;
  }

  onUpdate() {
    if (this.emailForm.invalid) {
      return;
    }

    this.isUpdating = true;
    this.emailForm.get('email')?.disable();

    this.authSrv
      .changeEmail(this.emailForm.get('email')?.value)
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.uiSrv.showSuccess(
            'Te enviaremos un email con los pasos a seguir para confirmar tu solicitud de cambio de email'
          );
        } else {
          this.uiSrv.showError(
            'No se pudo llevar a cabo tu solicitud. Intenta nuevamente mas tarde por favor.'
          );
          this.emailForm.get('email')?.enable();
          this.isUpdating = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
