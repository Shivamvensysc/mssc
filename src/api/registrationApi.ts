import api from './interceptor'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// District API
export const getDistricts = async () => {
  try {
    const response = await api.get(`${BASE_URL}/states/21/districts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const response = await api.get(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};