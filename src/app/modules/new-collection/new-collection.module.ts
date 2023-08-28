import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';

import { NewCollectionComponent } from './new-collection.component';
import { NewCollectionAddComponent } from './new-collection-add/new-collection-add.component';
import { NewCollectionProfileComponent } from './new-collection-profile/new-collection-profile.component';
import { NewCollectionRoutingModule } from './new-collection-routing.module';
import { NewCollectionChecklistComponent } from './new-collection-checklist/new-collection-checklist.component';
import { NewCollectionImageComponent } from './new-collection-image/new-collection-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NewCollectionListComponent } from './new-collection-list/new-collection-list.component';
import { NewChecklistComponent } from './new-checklist/new-checklist.component';

@NgModule({
  declarations: [
    NewCollectionComponent,
    NewCollectionAddComponent,
    NewCollectionProfileComponent,
    NewCollectionChecklistComponent,
    NewCollectionImageComponent,
    NewCollectionListComponent,
    NewChecklistComponent
  ],
  imports: [
    ImageCropperModule,
    MaterialModule,
    NewCollectionRoutingModule,
    SharedModule,
  ]
})
export class NewCollectionModule { }
