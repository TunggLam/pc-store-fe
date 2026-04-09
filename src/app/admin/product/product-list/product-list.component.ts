import {Component, OnInit} from '@angular/core';
import {UserResponse} from "../../../model/user-response";
import {LoadingService} from "../../../service/loading.service";
import {UserService} from "../../../service/user.service";
import {catchError, debounceTime, finalize, single, Subject, tap, throwError} from "rxjs";
import {ProductResponse} from "../../../model/product-response";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  pageIndex = 0;
  pageSize = 10;
  page = 1;
  public products: ProductResponse[] = [];
  totalElements: number = 0;
  searchText: string = '';
  searchSubject: Subject<string> = new Subject();

  constructor(private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getProducts(this.pageIndex, '', '')
    this.searchSubject.pipe(
      debounceTime(300) // Đợi 0.5 giây sau khi người dùng ngừng nhập
    ).subscribe(searchText => {
      this.getProducts(0, '', searchText); // Gọi hàm getProducts với searchText
    });
  }

  handlePageChange(page: number) {
    this.page = page - 1;
    this.getProducts(this.page, '', this.searchText);
  }

  onSearchChange(searchText: string): void {
    this.searchSubject.next(searchText);
  }

  getProducts(page: number, categoryId: string, search: string) {
    this.loadingService.show();
    return this.userService.getProducts(search, categoryId, page, this.pageSize).pipe(
      tap(res => {
        this.products = res?.products || [];
        this.totalElements = res.totalElements || 0;
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }
}
