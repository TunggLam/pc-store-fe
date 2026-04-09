import {Component, OnInit} from '@angular/core';
import {CartResponse} from "../../model/cart-response";
import {LoadingService} from "../../service/loading.service";
import {UserService} from "../../service/user.service";
import {catchError, finalize, tap, throwError} from "rxjs";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  carts: CartResponse[] = []
  totalPrice: number = 0
  address: string = '';
  cartId: string = '';

  constructor(private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.loadingService.show();
    return this.userService.getCart().pipe(
      tap(res => {
        this.carts = res?.cartItems || [];
        this.totalPrice = res?.totalAmount || 0;
        this.address = res?.address || '';
        this.cartId = res?.cartId || '';
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  removeCart(productId: string | undefined) {
    this.loadingService.show();
    if (productId) {
      return this.userService.removeCart(productId, this.cartId).pipe(
        tap(() => {
          this.getCart();
        }),
        catchError(err => {
          return throwError(err);
        }),
        finalize(() => {
          this.loadingService.hide();
        })
      ).subscribe();
    }
    return null;
  }

  addCart(productId: string | undefined) {
    this.loadingService.show();
    if (productId) {
      const request = {
        type: "ADD",
        productId: productId
      }
      return this.userService.updateCart(request).pipe(
        tap(() => {
          this.getCart();
        }),
        catchError(err => {
          return throwError(err);
        }),
        finalize(() => {
          this.loadingService.hide();
        })
      ).subscribe();
    }
    return null;
  }

  decreaseCart(productId: string | undefined) {
    this.loadingService.show();
    if (productId) {
      const request = {
        type: "DECREASE",
        productId: productId
      }
      return this.userService.updateCart(request).pipe(
        tap(() => {
          this.getCart();
        }),
        catchError(err => {
          return throwError(err);
        }),
        finalize(() => {
          this.loadingService.hide();
        })
      ).subscribe();
    }
    return null;
  }
}
