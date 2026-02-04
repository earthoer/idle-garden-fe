export const API_CONFIG = {
  BASE_URL: 'https://idle-garden-be-production.up.railway.app/api',
  ENDPOINTS: {
    // Auth
    GOOGLE_LOGIN: '/auth/google',
    GET_PROFILE: '/auth/profile', // ⭐ ใช้ /auth/profile แทน /auth/me
    
    // Game
    PLANT_TREE: '/game/plant',
    CLICK_TREE: '/game/click',
    SELL_TREE: '/game/sell',
    
    // Seeds & Locations
    GET_SEEDS: '/seeds',
    GET_AVAILABLE_SEEDS: '/seeds/available',
    GET_LOCATIONS: '/locations',
    GET_AVAILABLE_LOCATIONS: '/locations/available',
    
    // Ads
    AD_STATUS: '/ads/status',
    CLAIM_AD_REWARD: '/ads/reward',
    
    // Users
    GET_USER: '/users/me',
    UPDATE_USER: '/users/me',
    GET_USER_STATE: '/users/:userId/state',
  },
};

export const getFullUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
