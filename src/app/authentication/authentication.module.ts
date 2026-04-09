import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthenticationRoutingModule} from './authentication-routing.module';
import {LoginComponent} from './login/login.component';
import {SharedModule} from "../shared/shared.module";
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {ShowValidateErrorComponent} from "../common/show-validate-error/show-validate-error.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatSelectModule} from "@angular/material/select";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyOtpComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatDialogModule,
    ShowValidateErrorComponent,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ]
})
export class AuthenticationModule {
}
