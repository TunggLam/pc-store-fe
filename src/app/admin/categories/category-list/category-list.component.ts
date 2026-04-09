import {Component, OnInit} from '@angular/core';
import {UserResponse} from "../../../model/user-response";
import {LoadingService} from "../../../service/loading.service";
import {AdminService} from "../../../service/admin.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {CategoryResponse} from "../../../model/category-response";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  pageIndex = 0;
  pageSize = 10;
  page = 1;
  public categories: CategoryResponse[] = [];
  totalElements: number = 0;

  constructor(private loadingService: LoadingService,
              private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  handlePageChange(page: number) {
    this.page = page - 1;
    this.getCategories();
  }

  getCategories() {
    this.loadingService.show();
    return this.adminService.getCategories().pipe(
      tap(res => {
        this.categories = [...res?.categories as CategoryResponse[]] || [];
        this.totalElements = res.categories?.length || 0;
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
