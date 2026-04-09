import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, debounceTime, finalize, Subject, tap, throwError} from 'rxjs';
import {AdminOrderResponse} from '../../../model/admin-order-response';
import {OrderStatisticsResponse} from '../../../model/order-statistics-response';
import {AdminService} from '../../../service/admin.service';
import {LoadingService} from '../../../service/loading.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: AdminOrderResponse[] = [];
  statistics: OrderStatisticsResponse | null = null;
  total = 0;
  page = 0;
  size = 10;
  filterStatus = '';
  filterUsername = '';

  private usernameSubject = new Subject<string>();

  readonly statusOptions = [
    {value: '', label: 'Tất cả trạng thái'},
    {value: 'PENDING', label: 'Chờ xác nhận'},
    {value: 'PROCESSING', label: 'Đang xử lý'},
    {value: 'SHIPPED', label: 'Đang giao hàng'},
    {value: 'COMPLETED', label: 'Hoàn thành'},
    {value: 'CANCELLED', label: 'Đã hủy'}
  ];

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadStatistics();
    this.usernameSubject.pipe(debounceTime(400)).subscribe(value => {
      this.filterUsername = value;
      this.page = 0;
      this.loadOrders();
    });
  }

  loadOrders(): void {
    this.loadingService.show();
    this.adminService.getOrders({
      page: this.page,
      size: this.size,
      status: this.filterStatus || undefined,
      username: this.filterUsername || undefined
    }).pipe(
      tap(res => {
        this.orders = res.orders || [];
        this.total = res.total || 0;
      }),
      catchError(err => throwError(err)),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }

  loadStatistics(): void {
    this.adminService.getOrderStatistics().pipe(
      tap(res => this.statistics = res),
      catchError(err => throwError(err))
    ).subscribe();
  }

  onStatusChange(): void {
    this.page = 0;
    this.loadOrders();
  }

  onUsernameInput(value: string): void {
    this.usernameSubject.next(value);
  }

  handlePageChange(newPage: number): void {
    this.page = newPage - 1;
    this.loadOrders();
  }

  goToDetail(orderId: string): void {
    this.router.navigate(['/admin/order', orderId]);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-pending',
      PROCESSING: 'badge-processing',
      SHIPPED: 'badge-shipped',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-cancelled'
    };
    return map[status] || '';
  }
}
