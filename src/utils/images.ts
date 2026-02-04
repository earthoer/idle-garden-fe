// Image Configuration
export const IMAGE_CONFIG = {
  // GitHub raw base URL
  BASE_URL: 'https://raw.githubusercontent.com/earthoer/image-deposit/main',
  
  // Alternative: ถ้าอยากเปลี่ยนไปใช้ backend
  // BASE_URL: 'https://idle-garden-be-production.up.railway.app',
};

/**
 * Convert API path to full image URL
 * @param path - Path from API (e.g., "/seeds/radish/radish_04.png")
 * @returns Full URL to image
 */
export const getImageUrl = (path: string): string => {
  // Already full URL
  if (path.startsWith('http')) return path;
  
  // Clean path
  let cleanPath = path;
  
  // Remove /assets/ prefix if exists
  if (cleanPath.startsWith('/assets/')) {
    cleanPath = cleanPath.replace('/assets/', '');
  }
  
  // Remove leading /
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  return `${IMAGE_CONFIG.BASE_URL}/${cleanPath}`;
};

/**
 * Get tree image based on growth progress
 * @param seedIcon - Base seed icon path (e.g., "/seeds/bean_sprout/bean_sprout_04.png")
 * @param progressPercent - Growth progress (0-100)
 * @returns Image URL for current growth stage
 */
export const getTreeImageByProgress = (seedIcon: string, progressPercent: number): string => {
  // Determine stage based on progress
  let stage = 1;
  if (progressPercent >= 76) {
    stage = 4;
  } else if (progressPercent >= 51) {
    stage = 3;
  } else if (progressPercent >= 26) {
    stage = 2;
  } else {
    stage = 1;
  }
  
  // Replace _04 with appropriate stage
  // e.g., "/seeds/bean_sprout/bean_sprout_04.png" → "/seeds/bean_sprout/bean_sprout_02.png"
  const stageIcon = seedIcon.replace(/_04\.png$/, `_0${stage}.png`);
  
  return getImageUrl(stageIcon);
};
