import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserResponse} from "../../../model/user-response";
import {catchError, finalize, tap} from "rxjs";
import {LoadingService} from "../../../service/loading.service";
import {AdminService} from "../../../service/admin.service";


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  public user: UserResponse = {};

  constructor(private activatedRouter: ActivatedRoute,
              private loadingService: LoadingService,
              private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe(param => {
      const keycloakId = param.get('keycloakId');
      if (keycloakId) {
        this.getUserDetail(keycloakId);
      }
    })
  }

  getUserDetail(keycloakId: string) {
    this.loadingService.show();
    this.adminService.getUserDetail(keycloakId).pipe(
      tap(res => {
        this.user = res;
      }),
      catchError(err => {
        throw err;
      }), finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

}
