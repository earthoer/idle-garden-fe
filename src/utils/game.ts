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

// Gold formatting
export const formatGold = (gold: number): string => {
  if (gold >= 1_000_000) {
    return `${(gold / 1_000_000).toFixed(1)}M`;
  } else if (gold >= 1_000) {
    return `${(gold / 1_000).toFixed(1)}K`;
  }
  return gold.toString();
};

// Remaining time calculation
export const getRemainingTime = (plantedAt: Date, harvestableAt: Date): number => {
  const now = new Date().getTime();
  const harvestTime = new Date(harvestableAt).getTime();
  const remaining = Math.floor((harvestTime - now) / 1000);
  return Math.max(0, remaining);
};

// Combo calculation
export const calculateCombo = (consecutiveClicks: number): number => {
  if (consecutiveClicks >= 20) return 3.0;
  if (consecutiveClicks >= 10) return 2.0;
  if (consecutiveClicks >= 5) return 1.5;
  return 1.0;
};

export const calculateClickPower = (level: number): number => {
  return 1 + (level * 0.5);
};

export const calculateTimeReduction = (
  clicks: number,
  clickPower: number,
  combo: number
): number => {
  return Math.floor(clicks * clickPower * combo);
};
