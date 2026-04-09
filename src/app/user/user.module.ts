import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {UserRoutingModule} from './user-routing.module';
import {SharedModule} from "../shared/shared.module";
import {CartComponent} from './cart/cart.component';
import {ShopComponent} from './shop/shop.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyProfileLayoutComponent } from './my-profile-layout/my-profile-layout.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { CartHistoryComponent } from './cart-history/cart-history.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import {ShowValidateErrorComponent} from "../common/show-validate-error/show-validate-error.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    HomeComponent,
    CartComponent,
    ShopComponent,
    ProductDetailComponent,
    CheckoutComponent,
    MyProfileLayoutComponent,
    ConfirmPaymentComponent,
    CartHistoryComponent,
    ChangePasswordComponent,
    ProfileComponent
  ],
  exports: [
    CartComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ShowValidateErrorComponent,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class UserModule {
}
