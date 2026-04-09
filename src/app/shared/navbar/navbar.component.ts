import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isFixedTop: boolean = true;
  excludedUrls: string[] = ['/authentication/login', '/authentication/register', '/authentication/register/verify', '/authentication/forgot-password', '/not-found', '/vnpay/confirm-payment'];
  isAdmin: boolean = false;
  isLogin: boolean = false;
  isCloseNav = false;
  currentUser!: Observable<any>;
  displayName$!: Observable<string>;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeNavInNavigateRouter();
        const urlWithoutParams = this.router.url.split('?')[0];
        this.isFixedTop = !this.excludedUrls.includes(urlWithoutParams);
      }
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isAdmin();
    this.currentUser = this.authenticationService.tokenCurrent;
    this.displayName$ = this.authenticationService.displayName$;
  }

  logout() {
    this.isLogin = !this.isLogin;
    return this.authenticationService.logout('/');
  }

  closeNavInNavigateRouter(): void {
    const navbarCollapse = document.getElementById('navbarCollapse');
    if (navbarCollapse) {
      navbarCollapse.classList.remove('show');
    }
  }

  closeNavbar(isOpen: boolean): void {
    const navbarCollapse = document.getElementById('navbarCollapse');
    if (navbarCollapse) {
      if (isOpen) {
        navbarCollapse.classList.add('show');
      } else {
        navbarCollapse.classList.remove('show');
      }
    }
  }
}
