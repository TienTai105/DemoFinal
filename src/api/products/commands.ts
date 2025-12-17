/**
 * Product Commands - TanStack Query Mutations
 * Handles creating, updating, deleting products via API
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Product } from '../../types';

const API_BASE_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/products';

/**
 * Create a new product
 */
const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(API_BASE_URL, product);
  return response.data;
};

/**
 * Hook to create a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate products query to refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Update an existing product
 */
const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const response = await axios.put<Product>(`${API_BASE_URL}/${id}`, product);
  return response.data;
};

/**
 * Hook to update a product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      updateProduct(id, product),
    onSuccess: () => {
      // Invalidate products query
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Delete a product
 */
const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate products query
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
