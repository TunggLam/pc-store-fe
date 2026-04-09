import { AdminOrderItemResponse } from './admin-order-item-response';
import { AdminOrderPaymentResponse } from './admin-order-payment-response';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface AdminOrderResponse {
  orderId: string;
  username: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  statusLabel: string;
  items: AdminOrderItemResponse[];
  totalAmount: number;
  payment?: AdminOrderPaymentResponse;
  createdAt: string;
  updatedAt: string;
}
