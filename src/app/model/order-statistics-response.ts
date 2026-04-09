export interface OrderStatisticsResponse {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}
