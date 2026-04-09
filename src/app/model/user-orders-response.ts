import {UserOrderResponse} from './user-order-response';

export interface UserOrdersResponse {
  page: number;
  size: number;
  total: number;
  orders: UserOrderResponse[];
}
