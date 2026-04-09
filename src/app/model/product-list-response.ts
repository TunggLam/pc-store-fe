import {ProductResponse} from "./product-response";

export interface ProductListResponse {
  totalElements?: number
  products?: ProductResponse[]
}
