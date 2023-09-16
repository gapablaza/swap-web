import { NgModule } from '@angular/core';




import { NewPasswordRoutingModule } from './new-password-routing.module';
import { NewPasswordComponent } from './new-password.component';

@NgModule({
    imports: [
    NewPasswordRoutingModule,
    NewPasswordComponent,
]
})
export class NewPasswordModule { }
