import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@idle_garden_token',
  USER_DATA: '@idle_garden_user',
  GAME_STATE: '@idle_garden_state',
};

export const storage = {
  // Auth Token
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // User Data
  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Game State (for offline mode)
  async saveGameState(state: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  },

  async getGameState(): Promise<any | null> {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Error getting game state:', error);
      return null;
    }
  },

  // Clear All
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.GAME_STATE,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
