export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orderCount: number;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  imageUrl: string;
  totalSold: number;
  totalRevenue: number;
}

export interface RecentOrder {
  orderId: string;
  customerName: string;
  username: string;
  totalAmount: number;
  status: string;
  statusLabel: string;
  createdAt: string;
}

export interface RecentUser {
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  categoryName: string;
}

export interface DashboardResponse {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  monthlyRevenue: MonthlyRevenue[];
  topSellingProducts: TopSellingProduct[];
  recentOrders: RecentOrder[];
  recentUsers: RecentUser[];
  lowStockProducts: LowStockProduct[];
}
