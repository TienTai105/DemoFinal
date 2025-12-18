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

// Config
export { MOCKAPI_ENDPOINTS, PRODUCTS_API } from './config';
