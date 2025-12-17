import axios from 'axios';
import type { Product } from '../types';

const API_BASE = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/products';

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(API_BASE);
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await axios.get<Product>(`${API_BASE}/${id}`);
  return res.data;
};

export const addProduct = async (payload: Omit<Product, 'id'>): Promise<Product> => {
  const res = await axios.post<Product>(API_BASE, payload);
  return res.data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const res = await axios.put<Product>(`${API_BASE}/${product.id}`, product);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};