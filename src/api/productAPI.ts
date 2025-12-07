import axiosInstance from './axiosConfig';
import type { Product, ApiResponse, PaginatedResponse } from '../types';

export const productAPI = {
  // Get all products
  getAllProducts: async (
    page = 1,
    pageSize = 12,
    filters?: { category?: string; minPrice?: number; maxPrice?: number; searchTerm?: string }
  ) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>('/products', {
      params: {
        page,
        pageSize,
        ...filters,
      },
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, page = 1, pageSize = 12) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products/category/${category}`,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },

  // Search products
  searchProducts: async (searchTerm: string, page = 1, pageSize = 12) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>('/products/search', {
      params: {
        q: searchTerm,
        page,
        pageSize,
      },
    });
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/products/featured');
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId: string) => {
    const response = await axiosInstance.get(`/products/${productId}/reviews`);
    return response.data;
  },
};
