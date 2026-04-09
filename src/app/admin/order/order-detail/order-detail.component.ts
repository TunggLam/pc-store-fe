import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, finalize, tap, throwError} from 'rxjs';
import {AdminOrderResponse, OrderStatus} from '../../../model/admin-order-response';
import {AdminService} from '../../../service/admin.service';
import {LoadingService} from '../../../service/loading.service';
import {AlertService} from '../../../service/alert.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: AdminOrderResponse | null = null;
  orderId = '';
  isUpdating = false;

  /** Flow chính (CANCELLED được xử lý riêng) */
  readonly statusFlow: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED'];

  readonly statusLabels: Record<OrderStatus, string> = {
    PENDING: 'Chờ xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao hàng',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    this.loadOrder();
  }

  loadOrder(): void {
    this.loadingService.show();
    this.adminService.getOrderDetail(this.orderId).pipe(
      tap(res => this.order = res),
      catchError(err => throwError(err)),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }

  /** Có thể cập nhật nếu chưa COMPLETED / CANCELLED */
  canUpdate(): boolean {
    return !!this.order &&
      this.order.status !== 'COMPLETED' &&
      this.order.status !== 'CANCELLED';
  }

  /** Lấy trạng thái tiếp theo trong flow */
  getNextStatus(): OrderStatus | null {
    if (!this.order) return null;
    const idx = this.statusFlow.indexOf(this.order.status);
    return (idx >= 0 && idx < this.statusFlow.length - 1)
      ? this.statusFlow[idx + 1]
      : null;
  }

  updateStatus(): void {
    const next = this.getNextStatus();
    if (!next || !this.order) return;

    this.isUpdating = true;
    this.adminService.updateOrderStatus(this.orderId, {status: next}).pipe(
      tap(() => {
        this.alertService.alertSuccess(`Cập nhật trạng thái: ${this.statusLabels[next]}`);
        this.loadOrder();
      }),
      catchError(err => throwError(err)),
      finalize(() => this.isUpdating = false)
    ).subscribe();
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

  /** Trả về trạng thái của mỗi bước trong progress bar */
  getStepStatus(step: OrderStatus): 'done' | 'active' | 'pending' {
    if (!this.order || this.order.status === 'CANCELLED') return 'pending';
    const currentIdx = this.statusFlow.indexOf(this.order.status);
    const stepIdx = this.statusFlow.indexOf(step);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  }

  goBack(): void {
    this.router.navigate(['/admin/order']);
  }
}
