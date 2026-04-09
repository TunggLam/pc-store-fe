import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {catchError, Observable, switchMap, tap, throwError} from "rxjs";
import {AlertService} from "../../service/alert.service";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";
import {LoginResponse} from "../../model/loginResponse";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private isRefresh: boolean = false;

  constructor(private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401: {
              if (this.authenticationService.currentUserValue && !this.isRefresh) {
                return this.refreshToken(req, next);
              } else {
                this.logout();
              }
              break;
            }
            case 403: {
              this.alertService.alertError('Bạn không có quyền truy cập vào trang này');
              break;
            }
            case 500:
            case 503: {
              this.alertService.alertError('Dịch vụ tạm thời gián đoạn. Vui lòng thử lại sau ít phút.');
              break;
            }
            case 404: {
              this.alertService.alertError('Không tìm thấy dữ liệu tương ứng');
              break;
            }
            case 400: {
              this.alertService.alertError(err.error?.message);
              break;
            }
            case 0 : {
              this.alertService.alertError('Đường truyền không ổn định, vui lòng kiểm tra lại.');
              break;
            }
          }
        }
        return throwError(err);
      })
    );
  }

  private logout() {
    localStorage.clear();
    this.authenticationService.logout('/authentication/login');
    this.alertService.alertError('Bạn cần đăng nhập trước khi tiếp tục');
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler) {
    this.isRefresh = true;
    // Làm mới token
    return this.authenticationService.refresh().pipe(
      switchMap((response: LoginResponse) => {
        // Sau khi làm mới token, gọi lại API với token mới
        this.isRefresh = false;
        const clonedRequest = this.addTokenHeader(req, response?.accessToken || '');
        return next.handle(clonedRequest);
      }),
      catchError(refreshError => {
        console.log('----err', refreshError)
        // Nếu làm mới token thất bại, xử lý logout
        this.isRefresh = false;
        localStorage.clear();
        this.authenticationService.logout('/authentication/login');
        this.alertService.alertError('Bạn cần đăng nhập trước khi tiếp tục');
        return throwError(refreshError);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
  }
}
