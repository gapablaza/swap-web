import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Subscription, take } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SettingsOnlyService } from '../settings-only.service';
import { SettingsProfileImageComponent } from '../settings-profile-image/settings-profile-image.component';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss'],
})
export class SettingsProfileComponent implements OnInit, OnDestroy {
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;
  updateForm!: FormGroup;
  authUser: User = {} as User;
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;
  placesOptions: any;
  isApiLoaded = false;
  isDeleting = false;
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private setOnlySrv: SettingsOnlyService,
    private formBuilder: FormBuilder,
    
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    console.log('SettingsProfileComponent');

    if(!this.uiSrv.isGMapsLoaded()) {
      this.loadScript().then(() =>{
        this.isApiLoaded = true;
        this.uiSrv.setGMapStatus(true);
      })
    } else {
      this.isApiLoaded = true;
    }

    this.setOnlySrv.setTitles({
      title: 'Editar perfil',
      subtitle: 'Define tus datos de acceso público',
    });

    this.placesOptions = new Options({
      types: ['(cities)'],
      fields: ['address_components', 'formatted_address'],
    });

    let authSub = this.authSrv.authUser.subscribe((user) => {
      this.authUser = user;

      this.updateForm = this.formBuilder.group({
        active: [this.authUser.active, Validators.required],
        name: [
          this.authUser.displayName,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
          ],
        ],
        location: [this.authUser.location, Validators.required],
        addressComponents: [
          this.authUser.address_components,
          Validators.required,
        ],
        bio: [this.authUser.bio, Validators.maxLength(400)],
      });

      this.isLoaded = true;
    });
    this.subs.add(authSub);
  }

  loadScript() {
    return new Promise((resolve, reject) => {
      const element = this.document.createElement('script');
      element.type = 'text/javascript';
      element.src = `https://maps.googleapis.com/maps/api/js?key=${environment.google.apiKey}&libraries=places&language=en`;
      element.onload = resolve;
      element.onerror = reject;
      this.elementRef.nativeElement.appendChild(element);
    })
  }

  get form() {
    return this.updateForm.controls;
  }

  handleAddressChange(address: any) {
    if (address.address_components) {
      this.updateForm
        .get('addressComponents')
        ?.setValue(address.address_components);
    }
  }

  onChange(a: any) {
    this.updateForm.get('addressComponents')?.setValue('');
  }

  onBlur(a: any) {
    let timeout = setTimeout(() => {
      if (this.updateForm.get('addressComponents')?.value == '') {
        this.updateForm.get('location')?.setValue('');
      }
    }, 400);
    clearTimeout(timeout);
  }

  onSubmit() {
    this.isSaving = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.authSrv
      .updateProfile(this.updateForm.value)
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.uiSrv.showSuccess('Perfil actualizado exitosamente');
        } else {
          this.uiSrv.showError(
            'No se pudo actualizar tu perfil. Intenta nuevamente mas tarde por favor.'
          );
        }
        this.isSaving = false;
      });
  }

  onNewImage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['profile-image'];
    dialogConfig.width = '375px';
    // dialogConfig.maxWidth = '500px';

    this.dialog.open(SettingsProfileImageComponent, dialogConfig);
  }

  onDeleteImage() {
    this.dialog.open(this.deleteDialog, { disableClose: true });
  }

  onConfirmDelete() {
    this.isDeleting = true;

    this.authSrv
      .removeAvatar()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.uiSrv.showSuccess('Imagen removida exitosamente');
        } else {
          this.uiSrv.showError('No se pudo remover tu imagen de perfil');
        }
        this.dialog.closeAll();
        this.isDeleting = false;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
