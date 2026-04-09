import {Component, OnInit} from '@angular/core';
import {catchError, finalize, tap, throwError} from 'rxjs';
import {UserOrderResponse} from '../../model/user-order-response';
import {UserService} from '../../service/user.service';
import {LoadingService} from '../../service/loading.service';

@Component({
  selector: 'app-cart-history',
  templateUrl: './cart-history.component.html',
  styleUrls: ['./cart-history.component.css']
})
export class CartHistoryComponent implements OnInit {
  orders: UserOrderResponse[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  filterStatus = '';
  selectedOrder: UserOrderResponse | null = null;

  readonly statusOptions = [
    {value: '', label: 'Tất cả trạng thái'},
    {value: 'PENDING', label: 'Chờ xác nhận'},
    {value: 'PROCESSING', label: 'Đang xử lý'},
    {value: 'SHIPPED', label: 'Đang giao hàng'},
    {value: 'COMPLETED', label: 'Hoàn thành'},
    {value: 'CANCELLED', label: 'Đã hủy'}
  ];

  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loadingService.show();
    this.userService.getUserOrders(this.pageIndex, this.pageSize, this.filterStatus || undefined).pipe(
      tap(res => {
        this.orders = res.orders || [];
        this.total = res.total || 0;
      }),
      catchError(err => throwError(err)),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }

  onStatusChange(): void {
    this.pageIndex = 0;
    this.loadOrders();
  }

  handlePageChange(page: number): void {
    this.pageIndex = page - 1;
    this.loadOrders();
  }

  openDetail(order: UserOrderResponse): void {
    this.selectedOrder = order;
  }

  closeDetail(): void {
    this.selectedOrder = null;
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
