import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingService} from "../../service/loading.service";
import {UserService} from "../../service/user.service";
import {ProductResponse} from "../../model/product-response";
import {catchError, finalize, tap, throwError} from "rxjs";
import {AlertService} from "../../service/alert.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public product: ProductResponse = {};
  public quantity: number = 1;

  constructor(private activatedRouter: ActivatedRoute,
              private loading: LoadingService,
              private userService: UserService,
              private alert: AlertService) {

  }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe(param => {
      const productId = param.get('id');
      if (productId) {
        this.getProductDetail(productId);
      }
    })
  }

  getProductDetail(id: string) {
    this.loading.show();
    return this.userService.getProduct(id).pipe(
      tap(res => {
        this.product = res;
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading.hide();
      })
    ).subscribe()
  }

  addCart(productId: string, quantity: number) {
    this.loading.show();
    const request = {
      productId: productId,
      quantity: quantity
    }
    return this.userService.addCart(request).pipe(
      tap(() => {
        this.alert.alertSuccess('Thêm vào giỏ hàng thành công')
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loading.hide();
      })
    ).subscribe()
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

}
