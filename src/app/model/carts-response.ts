import {CartResponse} from "./cart-response";

export interface CartsResponse {
  cartItems?: CartResponse[],
  totalAmount?: number
  address?: string
  cartId?: string
}
