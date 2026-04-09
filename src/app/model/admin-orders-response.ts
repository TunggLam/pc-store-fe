import { AdminOrderResponse } from './admin-order-response';

export interface AdminOrdersResponse {
  page: number;
  size: number;
  total: number;
  orders: AdminOrderResponse[];
}
