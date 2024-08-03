import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoogleMapsModule } from '@angular/google-maps';
import { Store } from '@ngrx/store';

import { DEFAULT_USER_PROFILE_IMG } from 'src/app/core';
import { UIService } from 'src/app/shared';
import { SettingsProfileImageComponent } from '../settings-profile-image/settings-profile-image.component';
import { authFeature } from '../../auth/store/auth.state';
import { settingsFeature } from '../store/settings.state';
import { settingsActions } from '../store/settings.actions';
import { authActions } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,

    GoogleMapsModule,
    LazyLoadImageModule,
  ],
})
export class SettingsProfileComponent implements OnInit, OnDestroy {
  authUser$ = this.store.select(authFeature.selectUser);
  isLoaded$ = this.store.select(settingsFeature.selectIsProfileLoaded);
  isProcessing$ = this.store.select(authFeature.selectIsProcessing);
  defaultUserImage = DEFAULT_USER_PROFILE_IMG;

  @ViewChild('search') public searchElementRef!: ElementRef;
  @ViewChild('confirmDeleteDialog') deleteDialog!: TemplateRef<any>;

  updateForm!: FormGroup;
  isApiLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private uiSrv: UIService,
    private formBuilder: FormBuilder,

    private ngZone: NgZone
  ) {}

  configAutocomplete() {
    let timeout = setTimeout(() => {
      const autocomplete = new google.maps.places.Autocomplete(
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
            return;
          }

          this.updateForm
            .get('addressComponents')
            ?.setValue(place.address_components);
        });
      });
    }, 400);
    // clearTimeout(timeout);
  }

  ngOnInit(): void {
    this.store.dispatch(settingsActions.loadProfile());

    // load googlemaps
    this.uiSrv.loadGoogleMaps().then(() => {
      this.isApiLoaded = true;
      this.configAutocomplete();
    });

    const authSub = this.authUser$.subscribe((user) => {
      this.updateForm = this.formBuilder.group({
        active: [user.active, Validators.required],
        name: [
          user.displayName,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
          ],
        ],
        location: [user.location, Validators.required],
        addressComponents: [user.address_components, Validators.required],
        bio: [user.bio, Validators.maxLength(400)],
      });
    });
    this.subs.add(authSub);
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
    this.store.dispatch(authActions.updateProfile(this.updateForm.value));
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
    this.store.dispatch(authActions.removeAvatar());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
