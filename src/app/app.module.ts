import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationModule} from "./authentication/authentication.module";
import {LayoutModule} from "./layout/layout.module";
import {ErrorInterceptor} from "./authentication/interceptor/error-interceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {JwtInterceptor} from "./authentication/interceptor/jwt-Interceptor";
import {NgSwitcheryModule} from "angular-switchery-ios";
import {LoggingInterceptor} from "./authentication/interceptor/logging-interceptor";
import {ShowValidateErrorComponent} from "./common/show-validate-error/show-validate-error.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthenticationModule,
    LayoutModule,
    BrowserAnimationsModule,
    SharedModule,
    NgSwitcheryModule,
    ShowValidateErrorComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
