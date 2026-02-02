import { apiClient } from './client';
import { API_CONFIG } from './config';
import { Seed, Location, PlantedTree, User, ApiResponse } from '../types';

export const gameApi = {
  // Seeds
  async getSeeds(): Promise<Seed[]> {
    const response = await apiClient.get<ApiResponse<Seed[]>>(
      API_CONFIG.ENDPOINTS.GET_SEEDS
    );
    return response.data || [];
  },

  async getAvailableSeeds(): Promise<Seed[]> {
    const response = await apiClient.get<ApiResponse<Seed[]>>(
      API_CONFIG.ENDPOINTS.GET_AVAILABLE_SEEDS
    );
    return response.data || [];
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    const response = await apiClient.get<ApiResponse<Location[]>>(
      API_CONFIG.ENDPOINTS.GET_LOCATIONS
    );
    return response.data || [];
  },

  async getAvailableLocations(): Promise<Location[]> {
    const response = await apiClient.get<ApiResponse<Location[]>>(
      API_CONFIG.ENDPOINTS.GET_AVAILABLE_LOCATIONS
    );
    return response.data || [];
  },

  // User
  async getUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.GET_USER
    );
    if (!response.data) throw new Error('Failed to get user');
    return response.data;
  },

  // Game Actions
  async plantTree(seedId: string, slotIndex: number): Promise<PlantedTree> {
    const response = await apiClient.post<ApiResponse<PlantedTree>>(
      API_CONFIG.ENDPOINTS.PLANT_TREE,
      { seedId, slotIndex }
    );
    if (!response.data) throw new Error('Failed to plant tree');
    return response.data;
  },

  async clickTree(
    plantedTreeId: string,
    clicks: number,
    timeReduction: number
  ): Promise<{
    plantedTree: PlantedTree;
    user: User;
    clicksProcessed: number;
    timeReduced: number;
    newCombo: number;
  }> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLICK_TREE, {
      plantedTreeId,
      clicks,
      timeReduction,
    });
    if (!response.data) throw new Error('Failed to water tree');
    return response.data;
  },

  async sellTree(plantedTreeId: string): Promise<{
    seedName: string;
    quality: string;
    soldPrice: number;
    newGold: number;
    totalEarnings: number;
    totalTreesSold: number;
  }> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SELL_TREE, {
      plantedTreeId,
    });
    if (!response.data) throw new Error('Failed to sell tree');
    return response.data;
  },

  // Ads
  async getAdStatus(): Promise<{
    dailyAdsWatched: number;
    adsRemaining: number;
    canWatchAd: boolean;
    totalAdWatchCount: number;
  }> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AD_STATUS);
    if (!response.data) throw new Error('Failed to get ad status');
    return response.data;
  },

  async claimAdReward(
    boostType: 'time' | 'sell'
  ): Promise<{
    boostType: string;
    boostValue: number;
    dailyAdsWatched: number;
    adsRemaining: number;
    totalAdWatchCount: number;
  }> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLAIM_AD_REWARD, {
      boostType,
    });
    if (!response.data) throw new Error('Failed to claim ad reward');
    return response.data;
  },
};
