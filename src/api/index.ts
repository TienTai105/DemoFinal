/**
 * API Index
 * Centralized exports for all API functions and hooks
 */

// Product Queries - Functions
export { fetchProducts, fetchProductById } from './products/queries';

// Product Queries - Hooks
export { useProducts, useProductById } from './products/queries';

// Product Commands - Functions
export { addProduct, updateProduct, deleteProduct } from './products/commands';

// Product Commands - Hooks
export { useCreateProduct, useUpdateProduct, useDeleteProduct } from './products/commands';

// User Queries - Functions
export { fetchAllUsers, fetchUserById } from './users/queries';

// User Queries - Hooks
export { useUsers, useUser } from './users/queries';

// User Commands - Functions
export { createUser, updateUser, deleteUser } from './users/commands';

// User Commands - Hooks
export { useCreateUser, useUpdateUser, useDeleteUser } from './users/commands';

// Config
export { MOCKAPI_ENDPOINTS, PRODUCTS_API, USERS_API } from './config';
