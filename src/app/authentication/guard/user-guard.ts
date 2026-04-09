import {Injectable} from "@angular/core";
import {Router, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationService} from "../../service/authentication.service";
import {AlertService} from "../../service/alert.service";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class UserGuard {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private alert: AlertService) {
  }

  canActivate(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      this.router.navigateByUrl('/authentication/login');
      this.alert.alertError('Vui lòng đăng nhập để thực hiện chức năng này!')
      return false;
    }

    const jwtDecode = this.getDecodedAccessToken(token);
    if (!jwtDecode) {
      localStorage.clear()
      this.router.navigateByUrl('/authentication/login');
      this.alert.alertError('Vui lòng đăng nhập để thực hiện chức năng này!')
      return false;
    }

    const roles = jwtDecode.realm_access?.roles;
    if (!roles?.includes('ROLE_USER')) {
      localStorage.clear();
      this.router.navigateByUrl('/authentication/login');
      this.alert.alertError('Bạn không có quyền truy cập chức năng này!')
      return false;
    }
    return true;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

}
