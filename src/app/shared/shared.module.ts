import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedRoutingModule} from './shared-routing.module';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {NavbarAdminComponent} from './navbar-admin/navbar-admin.component';
import {PaginationComponent} from './pagination/pagination.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {LoadingComponent} from './loading/loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NavbarAdminComponent,
    PaginationComponent,
    NotFoundComponent,
    LoadingComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    NavbarAdminComponent,
    PaginationComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule {
}
