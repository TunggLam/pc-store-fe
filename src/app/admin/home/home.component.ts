import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AdminService } from '../../service/admin.service';
import {
  DashboardResponse,
  MonthlyRevenue,
  RecentOrder,
  RecentUser,
  TopSellingProduct,
  LowStockProduct
} from '../../model/dashboard-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = true;
  dashboard: DashboardResponse | null = null;

  // Chart config
  barChartType: ChartType = 'bar';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  barChartData: ChartData<any> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.datasetIndex === 0) {
              return ` Doanh thu: ${this.formatCurrency(ctx.raw as number)}`;
            }
            return ` Số đơn: ${ctx.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          callback: (value) => this.formatCurrencyShort(value as number)
        },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { stepSize: 1 }
      }
    }
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.buildChart(data.monthlyRevenue);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private buildChart(monthly: MonthlyRevenue[]): void {
    this.barChartData = {
      labels: monthly.map(m => this.formatMonth(m.month)),
      datasets: [
        {
          type: 'bar',
          label: 'Doanh thu',
          data: monthly.map(m => m.revenue),
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: '#4caf50',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Số đơn',
          data: monthly.map(m => m.orderCount),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#2196f3',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  }

  formatMonth(month: string): string {
    const [year, m] = month.split('-');
    return `T${parseInt(m)}/${year}`;
  }

  formatCurrency(value: number): string {
    if (value == null) return '0đ';
    return value.toLocaleString('vi-VN') + 'đ';
  }

  formatCurrencyShort(value: number): string {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  }

  formatDateTime(dt: string): string {
    if (!dt) return '';
    const d = new Date(dt);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm} ${hh}:${min}`;
  }

  formatDate(dt: string): string {
    if (!dt) return '';
    const d = new Date(dt);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  shortOrderId(orderId: string): string {
    return orderId ? '#' + orderId.substring(0, 8).toUpperCase() : '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'badge-completed';
      case 'PENDING': return 'badge-pending';
      case 'PROCESSING': return 'badge-processing';
      case 'SHIPPED': return 'badge-shipped';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-default';
    }
  }

  getStockClass(qty: number): string {
    if (qty <= 2) return 'stock-critical';
    if (qty <= 5) return 'stock-low';
    return '';
  }

  getAvatarColor(name: string): string {
    const colors = ['#e91e63','#9c27b0','#3f51b5','#2196f3','#009688','#ff5722','#795548'];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  }

  getAvatarInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
