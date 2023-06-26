import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { GoogleMapsModule } from '@angular/google-maps';

import { MaterialModule } from 'src/app/shared/material.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule, SocialModule } from 'src/app/shared';

import { SettingsComponent } from './settings.component';
import { SettingsConnectComponent } from './settings-connect/settings-connect.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { SettingsProfileImageComponent } from './settings-profile-image/settings-profile-image.component';
import { SettingsDeleteComponent } from './settings-delete/settings-delete.component';

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsConnectComponent,
        SettingsNotificationsComponent,
        SettingsProfileComponent,
        SettingsProfileImageComponent,
        SettingsDeleteComponent
    ],
    imports: [
        SharedModule,
        SocialModule,
        MaterialModule,
        GoogleMapsModule,
        // GooglePlaceModule,
        SettingsRoutingModule,
        ImageCropperModule,
    ]
})
export class SettingsModule { }
