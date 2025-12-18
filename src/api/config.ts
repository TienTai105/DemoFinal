/**
 * MockAPI Configuration
 * Centralized configuration for all MockAPI endpoints
 * This ensures consistency across the entire application
 */

// MockAPI Base URL - Can be changed to point to different environment
export const MOCKAPI_BASE_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api';

// MockAPI Endpoints
export const MOCKAPI_ENDPOINTS = {
  PRODUCTS: `${MOCKAPI_BASE_URL}/products`,
};

// Export individual endpoints for convenience
export const PRODUCTS_API = MOCKAPI_ENDPOINTS.PRODUCTS;

export default MOCKAPI_ENDPOINTS;
