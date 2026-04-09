import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication.service";
import {catchError, finalize, ReplaySubject, Subject, takeUntil, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {LoadingService} from "../../service/loading.service";
import {RegisterRequest} from "../../model/register-request";
import {AlertService} from "../../service/alert.service";
import * as bootstrap from 'bootstrap';
import {LocationService} from "../../service/location.service";
import {Location} from "../../model/location";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public cityFilterCtrl: FormControl = new FormControl();
  public districtFilterCtrl: FormControl = new FormControl();
  public communesFilterCtrl: FormControl = new FormControl();
  public filteredCities: ReplaySubject<Location[]> = new ReplaySubject<Location[]>(1);
  public filteredDistricts: ReplaySubject<Location[]> = new ReplaySubject<Location[]>(1);
  public filteredCommunes: ReplaySubject<Location[]> = new ReplaySubject<Location[]>(1);
  public formRegister!: FormGroup
  public email: string = 'example@gmail.com';
  public formVerifyOTP!: FormGroup;
  public isLoading = false;
  isUsernameExist = false;
  cities: Location[] = [];
  districts: Location[] = [];
  communes: Location[] = [];
  isDisableDistricts: boolean = true;
  isDisableCommunes: boolean = true;
  protected _onDestroy = new Subject<void>();

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private loadingService: LoadingService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private locationService: LocationService) {
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.buildFormVerifyOTP();
    this.buildFormRegister();
    this.getCities();
    this.filterCitiesIfValueChange();
    this.filterDistrictsIfValueChange();
    this.filterCommunesIfValueChange();
  }

  private filterCommunesIfValueChange() {
    this.communesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCommunes();
      });
  }

  private filterDistrictsIfValueChange() {
    this.districtFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDistricts();
      });
  }

  private filterCitiesIfValueChange() {
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCities();
      });
  }

  removeVietnameseAccents(str: string): string {
    const accentsMap = new Map([
      ['a', 'àáảãạâầấẩẫậăằắẳẵặ'],
      ['e', 'èéẻẽẹêềếểễệ'],
      ['i', 'ìíỉĩị'],
      ['o', 'òóỏõọôồốổỗộơờớởỡợ'],
      ['u', 'ùúủũụưừứửữự'],
      ['y', 'ỳýỷỹỵ'],
      ['d', 'đ'],
      ['A', 'ÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶ'],
      ['E', 'ÈÉẺẼẸÊỀẾỂỄỆ'],
      ['I', 'ÌÍỈĨỊ'],
      ['O', 'ÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢ'],
      ['U', 'ÙÚỦŨỤƯỪỨỬỮỰ'],
      ['Y', 'ỲÝỶỸỴ'],
      ['D', 'Đ']
    ]);

    for (const [nonAccentChar, accents] of accentsMap.entries()) {
      for (const accentChar of accents) {
        str = str.replace(new RegExp(accentChar, 'g'), nonAccentChar);
      }
    }
    return str;
  }

  protected filterCities() {
    if (!this.cities) {
      return;
    }
    this.resetValueDistrict();
    this.resetValueCommune();
    let search = this.removeVietnameseAccents(this.cityFilterCtrl.value);
    if (!search) {
      this.filteredCities.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCities.next(
      this.cities.filter(city => this.removeVietnameseAccents(city.full_name.toLowerCase()).indexOf(search) > -1)
    );
  }

  private resetValueCommune() {
    this.formRegister.get('commune')?.reset();
    this.filteredCommunes.next([]);
  }

  private resetValueDistrict() {
    this.formRegister.get('district')?.reset();
    this.filteredDistricts.next([]);
  }

  protected filterDistricts() {
    if (!this.districts) {
      return;
    }
    this.formRegister.get('commune')?.reset();
    this.filteredCommunes.next([]);
    let search = this.removeVietnameseAccents(this.districtFilterCtrl.value);
    if (!search) {
      this.filteredDistricts.next(this.districts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDistricts.next(
      this.districts.filter(district => this.removeVietnameseAccents(district.full_name.toLowerCase()).indexOf(search) > -1)
    );
  }

  protected filterCommunes() {
    if (!this.communes) {
      return;
    }
    let search = this.removeVietnameseAccents(this.communesFilterCtrl.value);
    if (!search) {
      this.filteredCommunes.next(this.communes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCommunes.next(
      this.communes.filter(commune => this.removeVietnameseAccents(commune.full_name.toLowerCase()).indexOf(search) > -1)
    );
  }

  getCommunes(event: any) {
    this.loadingService.show();
    return this.locationService.getCommunes(event.value).pipe(
      tap(res => {
        this.communes = res.data || [];
        this.isDisableCommunes = false;
        this.filteredCommunes.next(res.data || [])
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  getDistricts(event: any) {
    this.loadingService.show();
    return this.locationService.getDistricts(event.value).pipe(
      tap(res => {
        this.districts = res.data || [];
        this.filteredDistricts.next(res.data || []);
        this.isDisableDistricts = false;
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  getCities() {
    this.loadingService.show();
    return this.locationService.getCities().pipe(
      tap(res => {
        this.cities = res.data || []
        this.filteredCities.next(res.data || []);
      }),
      catchError(err => {
        return throwError(err)
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  private buildFormRegister() {
    this.formRegister = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      commune: new FormControl('', [Validators.required]),
    });
  }

  private buildFormVerifyOTP() {
    this.formVerifyOTP = this.formBuilder.group({
      otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
    });
  }

  onReset() {
    this.formRegister.reset();
  }

  openModal() {
    const element = document.getElementById('modalVerifyOTP') as HTMLElement;
    const modal = new bootstrap.Modal(element);
    modal.show();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formRegister.controls;
  }

  get f2(): { [key: string]: AbstractControl } {
    return this.formVerifyOTP.controls;
  }

  register() {
    if (this.formVerifyOTP.invalid) {
      this.formVerifyOTP.markAllAsTouched();
      return;
    }
    const otp = this.formVerifyOTP.get('otp')?.value;
    let request = this.buildRegisterRequest();
    request.otp = otp
    return this.authenticationService.register(request).pipe(
      tap(() => {
        const requestLogin = {
          username: request.username || '',
          password: request.password || ''
        }
        this.authenticationService.login(requestLogin).pipe(
          tap(response => {
            /* Nếu người dùng ko có role thì không cho đăng nhập */
            if (!response.roles || response.roles.length === 0) {
              this.router.navigateByUrl('/authentication/login')
              this.alertService.alertError('Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập lại')
              return;
            }
            if (response.roles.includes('ROLE_ADMIN')) {
              this.router.navigateByUrl('/admin');
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
          })
        ).subscribe();
      }),
      catchError(err => {
        return throwError(err);
      })
    ).subscribe();
  }

  sendOTP() {
    console.log(this.formRegister)
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return
    }
    this.loadingService.show();
    const request = this.buildSendOTPRequest();
    this.email = request.email;
    return this.authenticationService.sendOTP(request).pipe(
      tap(() => {
        this.openModal();
      }),
      catchError(err => {
        if (err.status === 400) {
          const errorResponse = err.error;
          if (errorResponse?.code === 'USERNAME_EXISTS') {
            this.isUsernameExist = true;
          }
        }
        return throwError(err);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()
  }

  private buildRegisterRequest(): RegisterRequest {
    const city = this.cities.filter(item => item.id === this.formRegister.get('city')?.value).map(item => item.full_name);
    const district = this.districts.filter(item => item.id === this.formRegister.get('district')?.value).map(item => item.full_name);
    const commune = this.communes.filter(item => item.id === this.formRegister.get('commune')?.value).map(item => item.full_name);
    return {
      username: this.formRegister.get('username')?.value,
      email: this.formRegister.get('email')?.value,
      password: this.formRegister.get('password')?.value,
      phoneNumber: this.formRegister.get('phoneNumber')?.value,
      address: `${commune} - ${district} - ${city}`,
      firstName: this.formRegister.get('firstName')?.value,
      lastName: this.formRegister.get('lastName')?.value,
    };
  }

  private buildSendOTPRequest() {
    return {
      username: this.formRegister.get('username')?.value,
      email: this.formRegister.get('email')?.value,
      type: 'REGISTER'
    };
  }

  maskEmail(email: string): string {
    // Kiểm tra tính hợp lệ của địa chỉ email
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      throw new Error('Invalid email address');
    }

    // Lấy phần tên và domain của địa chỉ email
    const [name, domain] = emailParts;

    // Kiểm tra độ dài phần tên để masking phù hợp
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`;
    }

    // Masking phần tên của địa chỉ email
    const maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    return `${maskedName}@${domain}`;
  }

}
