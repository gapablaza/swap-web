import { NgModule } from '@angular/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { MaterialModule } from 'src/app/shared/material.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule, SocialModule } from 'src/app/shared';

import { SettingsComponent } from './settings.component';
import { SettingsConnectComponent } from './settings-connect/settings-connect.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { SettingsProfileImageComponent } from './settings-profile-image/settings-profile-image.component';

import 'hammerjs';
// import * as Hammer from 'hammerjs';

// export class MyHammerConfig extends HammerGestureConfig {
//   overrides = <any> {
//     swipe: { direction: Hammer.DIRECTION_ALL },
//   };
// }

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsConnectComponent,
        SettingsNotificationsComponent,
        SettingsProfileComponent,
        SettingsProfileImageComponent
    ],
    imports: [
        SharedModule,
        SocialModule,
        MaterialModule,
        HammerModule,
        GooglePlaceModule,
        SettingsRoutingModule,
        ImageCropperModule,
    ]
})
export class SettingsModule { }
