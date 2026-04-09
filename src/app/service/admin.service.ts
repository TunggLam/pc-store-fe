import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map, Observable, throwError} from "rxjs";
import {UserListResponse} from "../model/user-list-response";
import {UserResponse} from "../model/user-response";
import {CategoriesResponse} from "../model/categories-response";
import {CategoryResponse} from "../model/category-response";
import {AdminOrdersResponse} from "../model/admin-orders-response";
import {AdminOrderResponse} from "../model/admin-order-response";
import {OrderStatisticsResponse} from "../model/order-statistics-response";
import {UpdateOrderStatusRequest} from "../model/update-order-status-request";
import {DashboardResponse} from "../model/dashboard-response";

const GET_DASHBOARD = `${environment.domain}/api/admin/dashboard`;
const GET_USERS = `${environment.domain}` + '/api/admin/users';
const GET_USER_DETAIL = `${environment.domain}/api/admin/user/`;
const CREATE_CATEGORY = `${environment.domain}/api/category`;
const GET_CATEGORIES = `${environment.domain}/api/categories`;
const CREATE_PRODUCT = `${environment.domain}/api/product`;
const GET_ORDERS = `${environment.domain}/api/admin/orders`;
const GET_ORDER_STATISTICS = `${environment.domain}/api/admin/orders/statistics`;
// const UPDATE_PRODUCT = `${environment.domain}/api/product/quantity`;

@Injectable({
  providedIn: 'root'
})
export class AdminService implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  getUsers(page: number, size: number): Observable<UserListResponse> {
    let headers = this.buildHeaders();
    let params = new HttpParams().set('page', page).set('size', size)

    return this.http.get<UserListResponse>(GET_USERS, {headers, params}).pipe(
      catchError(ex => {
        return throwError(ex);
      }),
      map(res => {
        return res;
      }));
  }

  getUserDetail(keycloakId: string): Observable<UserResponse> {
    let headers = this.buildHeaders();
    const url = GET_USER_DETAIL + keycloakId;
    return this.http.get<UserResponse>(url, {headers}).pipe(
      catchError(ex => {
        return throwError(ex);
      }),
      map(res => {
        return res;
      }));
  }

  createCategory(request: {}) {
    return this.http.post(CREATE_CATEGORY, request);
  }

  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(GET_CATEGORIES);
  }

  getCategory(id: string): Observable<CategoryResponse> {
    const url = `${environment.domain}/api/category/${id}`;
    return this.http.get<CategoryResponse>(url);
  }

  updateCategory(request: {}, id: string) {
    const url = `${environment.domain}/api/category/${id}`;
    return this.http.put(url, request);
  }

  createProduct(request: FormData) {
    return this.http.post<any>(CREATE_PRODUCT, request);
  }

  updateProduct(id: string, request: FormData) {
    const url = `${environment.domain}/api/product/${id}`;
    return this.http.put<any>(url, request);
  }

  // ── Order APIs ──────────────────────────────────────────────

  getOrders(params: {
    page?: number;
    size?: number;
    username?: string;
    status?: string;
  }): Observable<AdminOrdersResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 0)
      .set('size', params.size ?? 10);
    if (params.username) httpParams = httpParams.set('username', params.username);
    if (params.status)   httpParams = httpParams.set('status', params.status);
    return this.http.get<AdminOrdersResponse>(GET_ORDERS, { params: httpParams }).pipe(
      catchError(ex => throwError(ex))
    );
  }

  getOrderDetail(orderId: string): Observable<AdminOrderResponse> {
    const url = `${GET_ORDERS}/${orderId}`;
    return this.http.get<AdminOrderResponse>(url).pipe(
      catchError(ex => throwError(ex))
    );
  }

  updateOrderStatus(orderId: string, data: UpdateOrderStatusRequest): Observable<void> {
    const url = `${GET_ORDERS}/${orderId}/status`;
    return this.http.put<void>(url, data).pipe(
      catchError(ex => throwError(ex))
    );
  }

  getOrderStatistics(): Observable<OrderStatisticsResponse> {
    return this.http.get<OrderStatisticsResponse>(GET_ORDER_STATISTICS).pipe(
      catchError(ex => throwError(ex))
    );
  }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(GET_DASHBOARD).pipe(
      catchError(ex => throwError(ex))
    );
  }

  private buildHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'application/json');
  }
}
