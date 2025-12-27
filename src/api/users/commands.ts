/**
 * User Commands - TanStack Query Mutations
 * Handles creating, updating, deleting users via API
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { User } from '../../types';
import { USERS_API } from '../config';

/**
 * Create a new user
 */
const createUserFn = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post<User>(USERS_API, user);
  return response.data;
};

/**
 * Export for direct use (not hook)
 */
export const createUser = createUserFn;

/**
 * Hook to create a new user (for registration)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserFn,
    onSuccess: () => {
      // Invalidate users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Update an existing user
 */
const updateUserFn = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await axios.put<User>(`${USERS_API}/${id}`, user);
  return response.data;
};

/**
 * Export for direct use (not hook)
 */
export const updateUser = updateUserFn;

/**
 * Hook to update a user (for profile updates, admin edits)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: Partial<User> }) =>
      updateUserFn(id, user),
    onSuccess: () => {
      // Invalidate users query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Delete a user
 */
const deleteUserFn = async (id: string): Promise<void> => {
  await axios.delete(`${USERS_API}/${id}`);
};

/**
 * Export for direct use (not hook)
 */
export const deleteUser = deleteUserFn;

/**
 * Hook to delete a user (for admin user management)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      // Invalidate users query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
