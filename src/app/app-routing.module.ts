import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutUserComponent} from "./layout/layout-user/layout-user.component";
import {LayoutAdminComponent} from "./layout/layout-admin/layout-admin.component";
import {NotFoundComponent} from "./shared/not-found/not-found.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutUserComponent,
    loadChildren: () => import('./user/user.module').then(module => module.UserModule)
  },
  {
    path: 'admin',
    component: LayoutAdminComponent,
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule)
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
  },
  {
    path: '**',
    redirectTo: '/not-found'
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
