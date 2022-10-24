import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared';
import { MaterialModule } from 'src/app/shared/material.module';
import { CollaborateRoutingModule } from './collaborate-routing.module';

import { CollaborateComponent } from './collaborate.component';

@NgModule({
  declarations: [
    CollaborateComponent
  ],
  imports: [
    SharedModule,
    MaterialModule,
    CollaborateRoutingModule,
  ]
})
export class CollaborateModule { }
