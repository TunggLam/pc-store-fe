import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication.service";
import {LoadingService} from "../../service/loading.service";
import {catchError, finalize, tap, throwError} from "rxjs";
import {AlertService} from "../../service/alert.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public formGroup!: FormGroup;
  isEqualsPassword: boolean = true;

  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private loading: LoadingService,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    })
  }

  changePassword() {
    if (this.formGroup.invalid || !this.isEqualsPassword) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.loading.show();
    const request = {
      oldPassword: this.formGroup.get('oldPassword')?.value,
      newPassword: this.formGroup.get('newPassword')?.value
    }
    return this.authenticationService.changePassword(request).pipe(
      tap(() => {
        this.alert.alertSuccess('Cập nhật mật khẩu thành công');
        this.formGroup.reset();
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loading.hide()
      })
    ).subscribe()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  checkEqualsPassword() {
    this.isEqualsPassword = this.formGroup.get('newPassword')?.value === this.formGroup.get('confirmPassword')?.value;
    console.log(this.isEqualsPassword)
  }

}
