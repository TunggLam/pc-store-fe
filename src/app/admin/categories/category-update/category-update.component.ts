import {Component, OnInit} from '@angular/core';
import {CategoryResponse} from "../../../model/category-response";
import {catchError, finalize, tap, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../service/loading.service";
import {AdminService} from "../../../service/admin.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../service/alert.service";

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {

  category: CategoryResponse = {}
  formUpdate!: FormGroup;
  categoryId: string = '';

  constructor(private activatedRouter: ActivatedRoute,
              private loading: LoadingService,
              private adminService: AdminService,
              private router: Router,
              private fb: FormBuilder,
              private alert: AlertService) {

  }

  ngOnInit(): void {
    this.getCategory();
    this.formUpdate = this.fb.group({
      name: new FormControl('', [Validators.required])
    })
  }

  private getCategory() {
    this.activatedRouter.paramMap.subscribe(param => {
      this.categoryId = param.get('id') || '';
      if (this.categoryId) {
        this.getCategoryDetail(this.categoryId);
      }
    })
  }

  getCategoryDetail(categoryId: string) {
    this.loading.show();
    return this.adminService.getCategory(categoryId).pipe(
      tap(res => {
        this.category = res;
        this.formUpdate.patchValue({
          name: this.category.name
        })
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loading.hide()
      })
    ).subscribe()
  }

  updateCategory() {
    if (this.formUpdate.invalid) {
      this.formUpdate.markAllAsTouched();
      return;
    }
    const payload = {
      name: this.formUpdate.get('name')?.value,
      active: this.category.active
    }
    return this.adminService.updateCategory(payload, this.categoryId).pipe(
      tap(() => {
        this.router.navigateByUrl(`/admin/category/${this.category.id}`);
        this.alert.alertSuccess('Cập nhật thành công')
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {

      })
    ).subscribe()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formUpdate.controls;
  }

}
