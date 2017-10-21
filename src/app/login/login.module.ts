import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingSpinnerComponent } from '../ui/loading-spinner/loading-spinner.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule
    ],
    declarations: [
        LoginComponent,
        LoadingSpinnerComponent
    ]
})
export class LoginModule {
}
