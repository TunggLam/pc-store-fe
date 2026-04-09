import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../service/alert.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {LoadingService} from "../../service/loading.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public submitted = false;
  public formLogin!: FormGroup;
  public isLoading = false;

  constructor(private alertService: AlertService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private fb: FormBuilder,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    /* Nếu người dùng đã login thì ko cho vào trang login */
    this.checkLogin();
    this.formLogin = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    })
  }

  private checkLogin() {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/')
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formLogin.controls;
  }

  login() {
    this.submitted = true;
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.loadingService.show();
    const request = {
      username: this.formLogin.get('username')?.value,
      password: this.formLogin.get('password')?.value
    }

    this.authenticationService.login(request).pipe(
      tap(response => {
        /* Nếu người dùng ko có role thì không cho đăng nhập */
        if (!response.roles || response.roles.length === 0) {
          this.router.navigateByUrl('/authentication/login')
          this.alertService.alertError('Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập lại')
          return;
        }
        if (response.roles.includes('ROLE_ADMIN')) {
          this.router.navigateByUrl('/admin');
          this.alertService.alertSuccess("Đăng nhập thành công");
          return;
        } else if (response.roles.includes('ROLE_USER')) {
          this.router.navigateByUrl('/');
          return;
        } else {
          this.router.navigateByUrl('/authentication/login')
          this.alertService.alertError('Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập lại')
          return;
        }
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.isLoading = false;
        this.loadingService.hide();
      })).subscribe()
  }

}
