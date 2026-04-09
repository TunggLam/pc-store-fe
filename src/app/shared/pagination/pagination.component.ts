import {Component, Input, Output, EventEmitter, OnInit, SimpleChange} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 0;
  @Input() currentPage: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];

  ngOnChanges(simple: any) {
    if (simple?.totalItems.currentValue !== simple?.totalItems.previousValue) {
      this.totalItems = simple?.totalItems.currentValue;
      this.calculateTotalPages();
    }
  }

  ngOnInit(): void {
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = this.generatePagesArray();
  }

  generatePagesArray(): number[] {
    const pages: number[] = [];

    if (this.totalPages <= 10) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 6) {
        for (let i = 1; i <= 7; i++) {
          pages.push(i);
        }
        pages.push(-1); // Representing "..."
        pages.push(this.totalPages);
      } else if (this.currentPage > this.totalPages - 6) {
        pages.push(1);
        pages.push(-1); // Representing "..."
        for (let i = this.totalPages - 6; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Representing "..."
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push(-1); // Representing "..."
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
    this.currentPage = page;
    this.pages = this.generatePagesArray();
  }

}
