/**
 * User Queries - TanStack Query (React Query)
 * Handles fetching user data from MockAPI
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { User } from '../../types';
import { USERS_API } from '../config';

/**
 * Fetch all users from API
 */
const fetchAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(USERS_API);
  return response.data;
};

// Export function for direct use (not hook)
export { fetchAllUsers };

/**
 * Hook to fetch all users
 * Used for admin user management, login verification, etc.
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

/**
 * Fetch user by ID
 */
const fetchUserById = async (id: string): Promise<User> => {
  const response = await axios.get<User>(`${USERS_API}/${id}`);
  return response.data;
};

// Export function for direct use (not hook)
export { fetchUserById };

/**
 * Hook to fetch single user by ID
 */
export const useUser = (id?: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    retry: 3,
    refetchOnReconnect: false,
  });
};
