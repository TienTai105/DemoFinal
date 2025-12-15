/**
 * Product Queries - TanStack Query (React Query)
 * Handles fetching product data from MockAPI
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Product } from '../../types';

const API_BASE_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/products';

/**
 * Fetch all products from API
 */
const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_BASE_URL);
  return response.data;
};

/**
 * Hook to fetch all products
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

/**
 * Fetch product by ID
 */
const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Hook to fetch single product by ID
 */
export const useProductById = (id?: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes - cache for better reload experience
    gcTime: 1000 * 60 * 10,
    retry: 3,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true,
  });
};

/**
 * Fetch products by category
 */
const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_BASE_URL);
  // Filter by category on client side since MockAPI doesn't support query params
  return response.data.filter((product) => product.category === category);
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};
