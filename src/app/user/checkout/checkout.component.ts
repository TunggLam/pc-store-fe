import {Component, OnInit} from '@angular/core';
import {catchError, finalize, tap, throwError} from "rxjs";
import {LoadingService} from "../../service/loading.service";
import {UserService} from "../../service/user.service";
import {CartResponse} from "../../model/cart-response";
import {UserResponse} from "../../model/user-response";
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  carts: CartResponse[] = []
  totalPrice: number = 0
  address: string = '';
  user: UserResponse = {}

  constructor(private loadingService: LoadingService,
              private userService: UserService,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.getCart();
    this.getProfile();
  }

  pay() {
    return this.userService.initOrderPayment().pipe(
      tap(res => {
        if (res?.target) {
          window.location.href = res?.target;
        }else {
          this.alert.alertError('Có lỗi xảy ra trong quá trình tạo đơn hàng')
        }
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {

      })
    ).subscribe();
  }

  getCart() {
    this.loadingService.show();
    return this.userService.getCart().pipe(
      tap(res => {
        this.carts = res?.cartItems || [];
        this.totalPrice = res?.totalAmount || 0;
        this.address = res?.address || '';
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  getProfile() {
    this.loadingService.show();
    return this.userService.myProfile().pipe(
      tap(res => {
        this.user = res;
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }
}
