import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  isSidebarCollapsed: boolean = false;
  isMobileSidebarOpen: boolean = false;
  activeSubmenu: string = '';

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.autoOpenSubmenu(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.autoOpenSubmenu(this.router.url);
        this.isMobileSidebarOpen = false;
      }
    });
  }

  private autoOpenSubmenu(url: string): void {
    if (url.startsWith('/admin/user')) {
      this.activeSubmenu = 'users';
    } else if (
      url.startsWith('/admin/product') ||
      url.startsWith('/admin/categor') ||
      url.startsWith('/admin/coupon')
    ) {
      this.activeSubmenu = 'products';
    } else if (url.startsWith('/admin/order')) {
      this.activeSubmenu = 'orders';
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (this.isSidebarCollapsed) {
      this.activeSubmenu = '';
    }
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  toggleSubmenu(menu: string): void {
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
    }
    this.activeSubmenu = this.activeSubmenu === menu ? '' : menu;
  }
}
