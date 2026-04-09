import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutAdminComponent} from './layout-admin/layout-admin.component';
import {LayoutUserComponent} from './layout-user/layout-user.component';
import {SharedModule} from "../shared/shared.module";
import {RouterOutlet} from "@angular/router";


@NgModule({
  declarations: [
    LayoutAdminComponent,
    LayoutUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterOutlet
  ]
})
export class LayoutModule {
}
