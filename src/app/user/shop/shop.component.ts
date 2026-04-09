import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, debounceTime, finalize, Subject, tap, throwError} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {LoadingService} from "../../service/loading.service";
import {UserService} from "../../service/user.service";
import {CategoryResponse} from "../../model/category-response";
import {ProductResponse} from "../../model/product-response";
import {AlertService} from "../../service/alert.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {

  public categories: CategoryResponse[] = [];
  public products: ProductResponse[] = [];
  pageIndex = 0;
  totalElements: number = 0;
  pageSize: number = 6;
  limit = 150;

  searchName = '';
  selectedCategoryId = '';

  private searchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.loadProducts();
    });

    this.getCategories();

    // Đọc keyword từ query param khi navigate từ trang chủ
    const keyword = this.route.snapshot.queryParamMap.get('keyword') || '';
    this.searchName = keyword;
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchName);
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadProducts();
  }

  onSelectChange(event: any): void {
    this.selectedCategoryId = event?.target?.value || '';
    this.pageIndex = 0;
    this.loadProducts();
  }

  onCategorySelect(categoryId: string | undefined): void {
    this.selectedCategoryId = categoryId || '';
    this.pageIndex = 0;
    this.loadProducts();
  }

  handlePageChange(page: number): void {
    this.pageIndex = page - 1;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loadingService.show();
    const categoryId = this.selectedCategoryId || undefined;

    const request$ = this.searchName
      ? this.userService.searchProducts(this.searchName, categoryId, this.pageIndex, this.pageSize)
      : this.userService.getProducts('', categoryId, this.pageIndex, this.pageSize);

    request$.pipe(
      tap(res => {
        this.products = res?.products || [];
        this.totalElements = res.totalElements || 0;
      }),
      catchError(err => throwError(err)),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }

  addCart(productId: string, event: Event) {
    event.stopPropagation();
    this.loadingService.show();
    const request = {productId};
    return this.userService.addCart(request).pipe(
      tap(() => {
        this.alertService.alertSuccess('Thêm vào giỏ hàng thành công');
      }),
      catchError(err => throwError(err)),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }

  getTruncatedDescription(description: any): string {
    if (!description) return '';
    if (description.length > this.limit) {
      return description.slice(0, this.limit) + '...';
    }
    return description;
  }

  getCategories(): void {
    this.loadingService.show();
    this.userService.getCategories(true).pipe(
      tap(res => {
        this.categories = res?.categories || [];
      }),
      catchError(err => throwError(err)),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }
}
