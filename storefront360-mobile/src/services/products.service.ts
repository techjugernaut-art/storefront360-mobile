import api from './api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  sku?: string;
  barcode?: string;
  categoryId?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

class ProductsService {
  /**
   * Get all products
   */
  async getProducts(params?: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/api/products', { params });
    return response.data;
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string) {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductData) {
    const response = await api.post('/api/products', data);
    return response.data;
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, data: UpdateProductData) {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string) {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  }

  /**
   * Search products by barcode
   */
  async searchByBarcode(barcode: string) {
    const response = await api.get(`/api/products/barcode/${barcode}`);
    return response.data;
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number, type: 'add' | 'subtract') {
    const response = await api.patch(`/api/products/${id}/stock`, {
      quantity,
      type,
    });
    return response.data;
  }
}

export const productsService = new ProductsService();
