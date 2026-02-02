// Combo calculation
export const calculateCombo = (consecutiveClicks: number): number => {
  if (consecutiveClicks >= 20) return 3.0; // 3x
  if (consecutiveClicks >= 10) return 2.0; // 2x
  if (consecutiveClicks >= 5) return 1.5;  // 1.5x
  return 1.0; // 1x (base)
};

export const getComboMultiplier = (combo: number): string => {
  if (combo >= 3) return '3x';
  if (combo >= 2) return '2x';
  if (combo >= 1.5) return '1.5x';
  return '1x';
};

export const getComboColor = (combo: number): string => {
  if (combo >= 3) return '#ff4444'; // red (fire!)
  if (combo >= 2) return '#ffaa00'; // orange
  if (combo >= 1.5) return '#44ff44'; // green
  return '#888888'; // gray
};

// Time formatting
export const formatTime = (seconds: number): string => {
  if (seconds <= 0) return 'Ready!';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

export const formatShortTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  }
  return `${minutes}m`;
};

// Number formatting
export const formatGold = (gold: number): string => {
  if (gold >= 1_000_000) {
    return `${(gold / 1_000_000).toFixed(1)}M`;
  } else if (gold >= 1_000) {
    return `${(gold / 1_000).toFixed(1)}K`;
  }
  return gold.toString();
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Progress calculation
export const calculateProgress = (
  currentTime: number,
  totalTime: number
): number => {
  if (totalTime === 0) return 100;
  const progress = ((totalTime - currentTime) / totalTime) * 100;
  return Math.max(0, Math.min(100, progress));
};

// Quality colors
export const getQualityColor = (quality: 'normal' | 'golden' | 'rainbow'): string => {
  switch (quality) {
    case 'rainbow':
      return '#ff00ff'; // purple/pink
    case 'golden':
      return '#ffd700'; // gold
    case 'normal':
    default:
      return '#4CAF50'; // green
  }
};

export const getQualityEmoji = (quality: 'normal' | 'golden' | 'rainbow'): string => {
  switch (quality) {
    case 'rainbow':
      return '🌈';
    case 'golden':
      return '⭐';
    case 'normal':
    default:
      return '🌱';
  }
};

// Image helpers
export const getImageUrl = (path: string): string => {
  const baseUrl = 'https://raw.githubusercontent.com/yourusername/idle-garden-assets/main';
  return `${baseUrl}${path}`;
};

// Click power calculation
export const calculateClickPower = (level: number): number => {
  return 1 + (level * 0.5); // Level 1 = 1.5s, Level 2 = 2s, etc.
};

// Calculate total time reduction with combo
export const calculateTimeReduction = (
  clicks: number,
  clickPower: number,
  combo: number
): number => {
  return Math.floor(clicks * clickPower * combo);
};

// Remaining time calculation
export const getRemainingTime = (plantedAt: Date, harvestableAt: Date): number => {
  const now = new Date().getTime();
  const harvestTime = new Date(harvestableAt).getTime();
  const remaining = Math.floor((harvestTime - now) / 1000);
  return Math.max(0, remaining);
};
