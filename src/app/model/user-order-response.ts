import {UserOrderItemResponse} from './user-order-item-response';

export type UserOrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface UserOrderResponse {
  orderId: string;
  status: UserOrderStatus;
  statusLabel: string;
  totalAmount: number;
  itemCount: number;
  items: UserOrderItemResponse[];
  createdAt: string;
}
