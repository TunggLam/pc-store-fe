import {Injectable} from "@angular/core";
import {AlertService} from "./alert.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HandleExceptionService {

  constructor(private alertService: AlertService, private router: Router) {

  }

  handleException(exception: any) {
    if (exception.status === 400) {
      this.alertService.alertError(exception.error.message)
    } else if (exception.status === 401) {
      this.router.navigateByUrl("/login")
      this.alertService.alertError("Hết phiên đăng nhập. Vui lòng đăng nhập lại")
    } else if (exception.status === 403) {
      this.router.navigateByUrl("/login")
      this.alertService.alertError("Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập lại")
    } else {
      this.alertService.alertError("Hệ thống tạm thời gián đoạn. Vui lòng thử lại")
    }
  }
}
