import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, map, Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginResponse} from "../model/loginResponse";
import {LoginRequest} from "../model/loginRequest";
import {Router} from "@angular/router";
import {AlertService} from "./alert.service";
import {LoadingService} from "./loading.service";
import {jwtDecode} from "jwt-decode";

const API_LOGIN = `${environment.domain}` + '/api/authentication/login';
const API_LOGOUT = `${environment.domain}` + '/api/authentication/logout';
const API_REGISTER = `${environment.domain}` + '/api/authentication/register';
const API_REFRESH = `${environment.domain}` + '/api/authentication/refresh';
const API_SEND_OTP = `${environment.domain}/api/otp/send`;
const API_PROFILE = `${environment.domain}/api/user/profile`;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public tokenCurrent: Observable<any | null> = this.tokenSubject.asObservable();

  private displayNameSubject = new BehaviorSubject<string>('');
  public displayName$: Observable<string> = this.displayNameSubject.asObservable();

  constructor(private http: HttpClient,
              private router: Router,
              private alert: AlertService,
              private loadingService: LoadingService) {
    const token = localStorage.getItem('token');
    this.tokenSubject.next(token);
    this.initDisplayName(token);
  }

  private initDisplayName(token: string | null): void {
    if (!token) return;
    const decoded = this.getDecodedAccessToken(token);
    if (!decoded) return;
    const first = decoded.given_name || '';
    const last = decoded.family_name || '';
    const name = (first + ' ' + last).trim() || decoded.preferred_username || localStorage.getItem('username') || '';
    this.displayNameSubject.next(name);
  }

  updateDisplayName(firstName: string, lastName: string): void {
    const name = (firstName + ' ' + lastName).trim();
    this.displayNameSubject.next(name);
  }

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(API_LOGIN, request)
      .pipe(
        catchError(ex => throwError(ex)),
        map(user => {
          if (user && user.accessToken) {
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('username', request.username);
            localStorage.setItem('refreshToken', user.refreshToken || '');
            this.tokenSubject.next(user.accessToken);
            this.fetchAndSetDisplayName();
          }
          return user;
        }));
  }

  private fetchAndSetDisplayName(): void {
    this.http.get<any>(API_PROFILE).pipe(
      tap(res => {
        this.updateDisplayName(res.firstName || '', res.lastName || '');
      }),
      catchError(() => throwError(''))
    ).subscribe();
  }

  register(request: any) {
    return this.http.post(API_REGISTER, request);
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      this.router.navigateByUrl("/authentication/login");
      this.alert.alertError('Bạn cần đăng nhập trước khi tiếp tục');
      return throwError('User not logged in');
    } else {
      const payload = {
        username: localStorage.getItem('username'),
        refreshToken: localStorage.getItem('refreshToken')
      };
      return this.http.post<LoginResponse>(API_REFRESH, payload).pipe(
        map(res => {
          if (res && res.accessToken) {
            localStorage.setItem('refreshToken', res.refreshToken || '');
            localStorage.setItem('token', res.accessToken || '');
            localStorage.setItem('username', payload.username || '');
            this.tokenSubject.next(res.accessToken);
          }
          return res;
        }),
        catchError(err => {
          this.alert.alertError('Có lỗi xảy ra khi làm mới token');
          this.router.navigateByUrl('/authentication/login');
          this.tokenSubject.next(null);
          return throwError(err);
        })
      );
    }
  }

  logout(url: string) {
    this.loadingService.show();
    const usernameStorage = localStorage.getItem('username');
    const request = {
      username: usernameStorage
    }
    return this.http.post(API_LOGOUT, request).pipe(
      map(res => {
        localStorage.clear();
        this.router.navigateByUrl(url);
        this.tokenSubject.next(null);
        this.displayNameSubject.next('');
        return res;
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  sendOTP(request: any) {
    return this.http.post(API_SEND_OTP, request);
  }

  get currentUserValue() {
    return this.tokenSubject.value;
  }

  changePassword(request: {}) {
    const url = `${environment.domain}/api/authentication/password`
    return this.http.post(url, request);
  }

  isAdmin(): boolean {
    const jwtDecode = this.getDecodedAccessToken(localStorage.getItem('token') || '');
    if (!jwtDecode) {
      return false;
    }
    return jwtDecode.realm_access?.roles?.includes('ROLE_ADMIN') || false;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

}
