import {Component, Input, OnInit} from '@angular/core';
import {AdminService} from "../../../service/admin.service";
import {UserResponse} from "../../../model/user-response";
import {catchError, finalize, tap} from "rxjs";
import {LoadingService} from "../../../service/loading.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  pageIndex = 0;
  pageSize = 10;
  page = 1;
  public users: UserResponse[] = [];
  totalElements: number = 0;

  constructor(private adminService: AdminService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.getUsers(this.pageIndex);
  }

  handlePageChange(page: number) {
    this.page = page - 1;
    this.getUsers(this.page);
  }

  getUsers(page: number) {
    this.loadingService.show();
    this.adminService.getUsers(page, this.pageSize).pipe(
      tap(res => {
        this.users = res.userProfiles || [];
        this.totalElements = res?.total || 0;
      }),
      catchError(err => {
        throw err;
      }), finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

}
