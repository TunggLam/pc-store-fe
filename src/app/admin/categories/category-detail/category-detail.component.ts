import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../service/loading.service";
import {AdminService} from "../../../service/admin.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {CategoryResponse} from "../../../model/category-response";

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

  id: string = '';
  category: CategoryResponse = {}

  constructor(private activatedRouter: ActivatedRoute,
              private loading: LoadingService,
              private adminService: AdminService) {

  }

  ngOnInit(): void {
    this.getCategory();
  }

  private getCategory() {
    this.activatedRouter.paramMap.subscribe(param => {
      const categoryId = param.get('id');
      if (categoryId) {
        this.getCategoryDetail(categoryId);
      }
    })
  }

  getCategoryDetail(categoryId: string) {
    this.loading.show();
    return this.adminService.getCategory(categoryId).pipe(
      tap(res => {
        this.category = res;
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loading.hide()
      })
    ).subscribe()
  }

}
