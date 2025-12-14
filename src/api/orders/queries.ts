/**
 * Order Queries - TanStack Query (React Query)
 * Handles order-related API calls to MockAPI
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Order } from '../../types';

const API_BASE_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/orders';

/**
 * Create a new order
 */
const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  const response = await axios.post<Order>(API_BASE_URL, orderData);
  return response.data;
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/**
 * Fetch all orders
 */
const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>(API_BASE_URL);
  return response.data;
};

/**
 * Hook to fetch all orders
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};

/**
 * Fetch order by ID
 */
const fetchOrderById = async (id: string): Promise<Order> => {
  const response = await axios.get<Order>(`${API_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Hook to fetch single order by ID
 */
export const useOrderById = (id?: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};
