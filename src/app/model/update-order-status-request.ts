import { OrderStatus } from './admin-order-response';

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
