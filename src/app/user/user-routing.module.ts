import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CartComponent} from "./cart/cart.component";
import {UserGuard} from "../authentication/guard/user-guard";
import {ShopComponent} from "./shop/shop.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {MyProfileLayoutComponent} from "././my-profile-layout/my-profile-layout.component";
import {ConfirmPaymentComponent} from "./confirm-payment/confirm-payment.component";
import {CartHistoryComponent} from "./cart-history/cart-history.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'cart/history',
    component: CartHistoryComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'my-profile',
    component: MyProfileLayoutComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: ProfileComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'order-history',
        component: CartHistoryComponent
      }
    ]
  },
  {
    path: 'vnpay/confirm-payment',
    component: ConfirmPaymentComponent,
    canActivate: [UserGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule {
}
