import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {CategoriesResponse} from "../model/categories-response";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ProductListResponse} from "../model/product-list-response";
import {CartResponse} from "../model/cart-response";
import {CartsResponse} from "../model/carts-response";
import {InitOrderResponse} from "../model/init-order-response";
import {UserOrdersResponse} from "../model/user-orders-response";

const GET_PRODUCTS = `${environment.domain}/api/products`;
const SEARCH_PRODUCTS = `${environment.domain}/api/products/search`;
const GET_PRODUCT = `${environment.domain}/api/product/`;
const ADD_CART = `${environment.domain}/api/cart`;
const GET_CART = `${environment.domain}/api/cart`;
const GET_USER_ORDERS = `${environment.domain}/api/user/orders`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  callbackPayment(request: {}) {
    const url = `${environment.domain}/api/payment/vnpay/callback`;
    return this.http.post(url, request);
  }

  myProfile() {
    const url = `${environment.domain}/api/user/profile`;
    return this.http.get<any>(url);
  }

  updateProfile(body: {firstName: string; lastName: string; email: string; phoneNumber: string; address: string}) {
    const url = `${environment.domain}/api/user/profile`;
    return this.http.put<any>(url, body);
  }

  initOrderPayment() {
    const url = `${environment.domain}/api/payment/vnpay/init`;
    return this.http.post<InitOrderResponse>(url, null);
  }

  getCart() {
    return this.http.get<CartsResponse>(GET_CART)
  }

  addCart(request: {}) {
    return this.http.post(ADD_CART, request)
  }

  updateCart(request: {}) {
    const url = `${environment.domain}/api/cart`;
    return this.http.put(url, request)
  }

  removeCart(productId: string, cartId: string) {
    const url = `${environment.domain}/api/cart/${cartId}/${productId}`;
    return this.http.delete(url)
  }

  getCategories(productCount: boolean): Observable<CategoriesResponse> {
    const url = `${environment.domain}/api/categories`;
    if (productCount) {
      let params = new HttpParams().set('productCount', true)
      return this.http.get<CategoriesResponse>(url, {params});
    }
    return this.http.get<CategoriesResponse>(url);
  }

  getProduct(id: string) {
    return this.http.get(`${GET_PRODUCT}${id}`)
  }

  getProducts(name: string, categoryId: string | undefined, page: number, size: number) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (name) params = params.set('name', name);
    return this.http.get<ProductListResponse>(GET_PRODUCTS, {params});
  }

  searchProducts(keyword: string, categoryId: string | undefined, page: number, size: number) {
    let params = new HttpParams().set('keyword', keyword).set('page', page).set('size', size);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<ProductListResponse>(SEARCH_PRODUCTS, {params});
  }

  getUserOrders(page: number, size: number, status?: string): Observable<UserOrdersResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<UserOrdersResponse>(GET_USER_ORDERS, {params});
  }
}
