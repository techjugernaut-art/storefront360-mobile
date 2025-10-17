import api from './api';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  costPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  orderNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'mobile_money' | 'card';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: 'cash' | 'mobile_money' | 'card';
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  discount?: number;
  notes?: string;
}

class SalesService {
  /**
   * Get all sales
   */
  async getSales(params?: {
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/api/sales', { params });
    return response.data;
  }

  /**
   * Get a single sale by ID
   */
  async getSale(id: string) {
    const response = await api.get(`/api/sales/${id}`);
    return response.data;
  }

  /**
   * Create a new sale
   */
  async createSale(data: CreateSaleData) {
    const response = await api.post('/api/sales', data);
    return response.data;
  }

  /**
   * Get today's sales summary
   */
  async getTodaySummary() {
    const response = await api.get('/api/sales/summary/today');
    return response.data;
  }

  /**
   * Get sales report
   */
  async getReport(params: {
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
  }) {
    const response = await api.get('/api/sales/report', { params });
    return response.data;
  }

  /**
   * Refund a sale
   */
  async refundSale(id: string, reason?: string) {
    const response = await api.post(`/api/sales/${id}/refund`, { reason });
    return response.data;
  }
}

export const salesService = new SalesService();
