import { apiClient } from './client';
import { API_CONFIG } from './config';
import { Seed, Location, PlantedTree, User, ApiResponse } from '../types';

export const gameApi = {
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

  async getLocations(): Promise<Location[]> {
    const response = await apiClient.get<ApiResponse<Location[]>>(
      API_CONFIG.ENDPOINTS.GET_LOCATIONS
    );
    return response.data || [];
  },

  async getUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.GET_USER
    );
    if (!response.data) throw new Error('Failed to get user');
    return response.data;
  },

  async plantTree(seedId: string, slotIndex: number): Promise<any> {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.PLANT_TREE,
      { seedId, slotIndex }
    );
    if (!response.data?.data) throw new Error('Failed to plant tree');
    return response.data.data; // Return { plantedTree, user }
  },

  async clickTree(
    plantedTreeId: string,
    clicks: number,
    timeReduction: number
  ): Promise<any> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLICK_TREE, {
      plantedTreeId,
      clicks,
      timeReduction,
    });
    if (!response.data) throw new Error('Failed to water tree');
    return response.data;
  },

  async sellTree(plantedTreeId: string): Promise<any> {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SELL_TREE, {
      plantedTreeId,
    });
    if (!response.data) throw new Error('Failed to sell tree');
    return response.data;
  },
};
