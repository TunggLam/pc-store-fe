import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {catchError, finalize, tap, throwError} from 'rxjs';
import {UserResponse} from '../../model/user-response';
import {UserService} from '../../service/user.service';
import {LoadingService} from '../../service/loading.service';
import {AlertService} from '../../service/alert.service';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserResponse = {};
  isEditing = false;
  isSaving = false;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loading: LoadingService,
    private alertService: AlertService,
    private authService: AuthenticationService
  ) {
    this.editForm = this.fb.group({
      firstName:   ['', [Validators.required]],
      lastName:    ['', [Validators.required]],
      email:       ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      address:     ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getMyProfile();
  }

  get f() { return this.editForm.controls; }

  getMyProfile(): void {
    this.loading.show();
    this.userService.myProfile().pipe(
      tap(res => { this.user = res; }),
      catchError(err => throwError(err)),
      finalize(() => this.loading.hide())
    ).subscribe();
  }

  startEdit(): void {
    this.editForm.setValue({
      firstName:   this.user.firstName   || '',
      lastName:    this.user.lastName    || '',
      email:       this.user.email       || '',
      phoneNumber: this.user.phoneNumber || '',
      address:     this.user.address     || ''
    });
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.markAsUntouched();
  }

  save(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) return;

    this.isSaving = true;
    this.userService.updateProfile(this.editForm.value).pipe(
      tap(res => {
        this.user = res;
        this.isEditing = false;
        this.authService.updateDisplayName(res.firstName || '', res.lastName || '');
        this.alertService.alertSuccess('Cập nhật thông tin thành công');
      }),
      catchError(err => {
        const msg = err?.error?.message || 'Cập nhật thất bại, vui lòng thử lại';
        this.alertService.alertError(msg);
        return throwError(err);
      }),
      finalize(() => { this.isSaving = false; })
    ).subscribe();
  }
}
