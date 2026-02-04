export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  gold: number;
  totalEarnings: number;
  totalTreesSold: number;
  clickPowerLevel: number;
  currentCombo: number;
  maxCombo: number;
  unlockedSeeds: string[];
  unlockedLocations: string[];
  currentLocation: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Seed {
  _id: string;
  code: string;
  name: string;
  basePrice: number;
  baseSellPrice: number;
  baseGrowTime: number;
  icon: string;
  description: string;
  unlockRequirement: {
    type: 'default' | 'gold' | 'trees_sold';
    value: number;
  };
  isEvent: boolean;
}

export interface Location {
  _id: string;
  code: string;
  name: string;
  price: number;
  order: number;
  bonusType: 'click_speed' | 'grow_speed' | 'sell_price';
  bonusValue: number;
  bonusMultiplier: number;
  icon: string;
  description: string;
  locationImageUrl: string;
  potImageUrl: string;
}

export interface PlantedTree {
  _id: string;
  userId: string;
  seedId: string;
  slotIndex: number;
  plantedAt: Date;
  harvestableAt: Date;
  startTime?: Date;  // ⭐ เพิ่มสำหรับ backend response
  endTime?: Date;    // ⭐ เพิ่มสำหรับ backend response
  currentGrowTime: number;
  totalGrowTime: number;
  quality: 'normal' | 'golden' | 'rainbow';
  isReady: boolean;
  locationBonus: number;
  timeReduced?: number; // ⭐ จำนวนวินาทีที่ลดไปแล้ว
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
