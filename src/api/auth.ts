import { apiClient } from './client';
import { API_CONFIG, getFullUrl } from './config';
import { User, ApiResponse } from '../types';
import { storage } from '../utils/storage';
import { Linking } from 'react-native';

export const authApi = {
  async loginWithGoogle(): Promise<void> {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.GOOGLE_LOGIN);
    await Linking.openURL(url);
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.GET_PROFILE
    );
    if (response.data) {
      await storage.saveUser(response.data);
      return response.data;
    }
    throw new Error('Failed to get user data');
  },

  async getGameState(): Promise<any> {
    // Get userId from profile first
    const profile = await this.getMe();
    const userId = (profile as any).userId || profile._id; // ← ใช้ userId ถูกต้อง
    
    // Get complete game state
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.GET_USER_STATE.replace(':userId', userId)
    );
    
    return response.data?.data || response.data;
  },

  async saveAuthToken(token: string): Promise<void> {
    await storage.saveToken(token);
  },

  async logout(): Promise<void> {
    await storage.clearAll();
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await storage.getToken();
    if (!token) return false;

    try {
      await this.getMe();
      return true;
    } catch {
      return false;
    }
  },
};
