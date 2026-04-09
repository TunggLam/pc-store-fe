import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AdminService} from "../../../service/admin.service";
import {Router} from "@angular/router";
import {LoadingService} from "../../../service/loading.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {AlertService} from "../../../service/alert.service";

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  isChecked: boolean = true;
  public formCreate: FormGroup = new FormGroup({
    categoryName: new FormControl(''),
    isChecked: new FormControl(true)
  });

  constructor(private adminService: AdminService,
              private router: Router,
              private loadingService: LoadingService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
  }

  creteCategory() {
    this.loadingService.show();
    const request = {
      name: this.formCreate.get('categoryName')?.value,
      isActive: this.isChecked
    }
    console.log(request)
    return this.adminService.createCategory(request).pipe(
      tap(res => {
        this.alertService.alertSuccess('Thêm mới thành công.')
        this.router.navigateByUrl('/admin/categories');
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

}
