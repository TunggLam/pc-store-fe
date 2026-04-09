import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {LoadingService} from "../../../service/loading.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {ProductResponse} from "../../../model/product-response";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-management-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public product: ProductResponse = {}

  constructor(private userService: UserService,
              private loading: LoadingService,
              private activatedRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getProduct()
  }

  getProduct() {
    this.loading.show();
    this.activatedRouter.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.userService.getProduct(id).pipe(
          tap(res => {
            this.product = res;
          }),
          catchError(err => {
            return throwError(err);
          }),
          finalize(() => {
            this.loading.hide();
          })
        ).subscribe();
      }
    })
  }

}
