// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string | string[];
  category: string;
  subCategory?: string;
  date?: number | string;
  bestseller?: boolean;
  newproduct?: boolean;
  rating?: number;
  reviews?: number;
  stock?: number;
  inCart?: boolean;
  quantity?: number;
  colors?: string[];
  sizes?: string[];
}

// Cart types
export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}

// Cart types
export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string; // 'admin' | 'user'
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

// Filter types
export interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  rating?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
