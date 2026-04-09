import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  scrollToTop(event: Event): void {
    event.preventDefault(); // Prevent the default anchor behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
