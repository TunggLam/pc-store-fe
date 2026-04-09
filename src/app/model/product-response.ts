import {CategoryResponse} from "./category-response";

export interface ProductResponse {
  id?: string,
  name?: string,
  imageUrl?: string,
  price?: number,
  quantity?: number,
  description?: number,
  category?: CategoryResponse
}
