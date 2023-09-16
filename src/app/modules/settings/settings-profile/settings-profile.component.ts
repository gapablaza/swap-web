import { DOCUMENT, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,

  NgZone,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

import { Subscription, take } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService, DEFAULT_USER_PROFILE_IMG, User } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SettingsOnlyService } from '../settings-only.service';
import { SettingsProfileImageComponent } from '../settings-profile-image/settings-profile-image.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-settings-profile',
    templateUrl: './settings-profile.component.html',
    styleUrls: ['./settings-profile.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatProgressSpinnerModule,
        LazyLoadImageModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        GoogleMapsModule,
    ],
})
export class SettingsProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('search') public searchElementRef!: ElementRef;

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
    private elementRef: ElementRef,

    private ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    let timeout = setTimeout(() => {

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['(cities)'],
          fields: ['address_components', 'formatted_address'],
        }
      );
  
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          if (!place.address_components) {
            // console.log('nada');
            return;
          }
  
          // console.log(place);
          this.updateForm
            .get('addressComponents')
            ?.setValue(place.address_components);
        });
      });

    }, 400);
    // clearTimeout(timeout);
  }

  ngOnInit(): void {
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

  onChange(a: any) {
    this.updateForm.get('addressComponents')?.setValue('');
    // console.log('onChange', this.updateForm.value);
  }

  onBlur(a: any) {
    let timeout = setTimeout(() => {
      if (this.updateForm.get('addressComponents')?.value == '') {
        this.updateForm.get('location')?.setValue('');
      }
    }, 400);
    clearTimeout(timeout);
    // console.log('onBlur', this.updateForm.value);
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
