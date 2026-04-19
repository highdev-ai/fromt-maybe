import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './api';
import { AuthResponse, LoginData, RegisterData } from '../types';

const TOKEN_KEY = 'jwt_token';

export const authService = {
  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/login', data);
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/register', data);
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  // Get stored token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
};