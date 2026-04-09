import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
  }

  title = 'ecommerce-web';

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Cuộn lên đầu trang khi điều hướng thành công
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
