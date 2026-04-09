import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoadingService} from "../../service/loading.service";
import {UserService} from "../../service/user.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {CategoryResponse} from "../../model/category-response";
import {ProductResponse} from "../../model/product-response";
import {AlertService} from "../../service/alert.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public categories: CategoryResponse[] = [];
  public products: ProductResponse[] = [];
  public productsBestSale: ProductResponse[] = [];
  limit = 150;
  searchKeyword = '';

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProducts('');
    this.getProductsBestSale();
  }

  getCategories() {
    this.loadingService.show();
    return this.userService.getCategories(false).pipe(
      tap(res => {
        this.categories = res?.categories || [];
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  getProducts(category: string) {
    this.loadingService.show();
    return this.userService.getProducts('', category, 0, 8).pipe(
      tap(res => {
        this.products = res.products || [];
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  getProductsBestSale() {
    this.loadingService.show();
    return this.userService.getProducts('', '', 0, 6).pipe(
      tap(res => {
        this.productsBestSale = res.products || [];
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  addCart(productId: string, event: Event) {
    event.stopPropagation();
    this.loadingService.show();
    const request = {
      productId: productId
    }
    return this.userService.addCart(request).pipe(
      tap(() => {
        this.alertService.alertSuccess('Thêm vào giỏ hàng thành công')
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  goToShopSearch(): void {
    const keyword = this.searchKeyword.trim();
    if (keyword) {
      this.router.navigate(['/shop'], {queryParams: {keyword}});
    } else {
      this.router.navigate(['/shop']);
    }
  }

  getTruncatedDescription(description: any): string {
    if (!description) return '';
    if (description.length > this.limit) {
      return description.slice(0, this.limit) + '...';
    }
    return description;
  }
}
