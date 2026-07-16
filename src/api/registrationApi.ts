import api from './interceptor'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Interfaces for Captcha responses
export interface CaptchaResponse {
  success: boolean;
  message?: string;
  captchaId: string;
  captchaSvg: string;
}

export interface CaptchaValidateResponse {
  success: boolean;
  message?: string;
}

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


// Captcha APIs
export const fetchCaptchaApi = async () => {
  try {
    const response = await api.get<CaptchaResponse>(`${BASE_URL}/auth/captcha`);
    return response;
  } catch (error) {
    console.error('Error fetching CAPTCHA:', error);
    throw error;
  }
};

export const validateCaptchaApi = async (captchaId: string, captchaText: string) => {
  try {
    const response = await api.post<CaptchaValidateResponse>(
      `${BASE_URL}/auth/captcha/validate`,
      {
        captchaId: captchaId,
        captchaText: captchaText,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error('Error validating CAPTCHA:', error);
    throw error;
  }
};