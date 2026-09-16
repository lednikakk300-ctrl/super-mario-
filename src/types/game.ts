export type Language = 'uz' | 'en' | 'ru';

export type ItemCategory = 'top' | 'bottom' | 'shoes' | 'hat' | 'accessory' | 'useful' | 'special';

export type OutfitSetId = 'set1' | 'set2' | 'set3';

export interface LocalizedText {
  uz: string;
  en: string;
  ru: string;
}

export interface CharacterDefinition {
  id: string;
  name: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  price: number;
  speed: number;
  jumpForce: number;
  maxLives: number;
  magnetRadius: number;
  colors: {
    skin: string;
    hair: string;
    eyes: string;
    shirt: string;
    pants: string;
    shoes: string;
  };
  specialTrait: LocalizedText;
}

export interface ShopItem {
  id: string;
  category: ItemCategory;
  setId?: OutfitSetId;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  iconName: string;
  colors: {
    primary: string;
    secondary?: string;
  };
  consumable?: boolean;
  effect?: {
    type: 'shield' | 'magnet' | 'speed' | 'life' | 'time';
    value: number;
  };
}

export interface LevelObjective {
  id: string;
  type: 'coins' | 'gems' | 'finish' | 'time' | 'no_damage';
  target: number;
  description: LocalizedText;
}

export interface LevelDefinition {
  id: number;
  worldId: number; // 1 to 5
  worldName: LocalizedText;
  theme: 'forest' | 'desert' | 'cyber' | 'volcano' | 'cosmic';
  name: LocalizedText;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  targetCoins: number;
  targetGems: number;
  timeLimit: number; // in seconds
  rewardCoins: number;
  bonusRewardCoins: number;
  rewardXp: number;
  levelLength: number; // width in pixels
  objectives: LevelObjective[];
}

export interface Achievement {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  target: number;
  rewardCoins: number;
  rewardXp: number;
  icon: string;
}

export interface DailyRewardItem {
  day: number;
  coins: number;
  xp: number;
  bonusItem?: {
    id: string;
    name: LocalizedText;
  };
}

export interface EquippedItems {
  top?: string;
  bottom?: string;
  shoes?: string;
  hat?: string;
  accessory?: string;
}

export interface CompletedLevelData {
  stars: number;
  highCoins: number;
  completedAt: string;
}

export interface PlayerData {
  coins: number;
  xp: number;
  level: number;
  highestUnlockedLevel: number;
  completedLevels: Record<number, CompletedLevelData>;
  selectedCharacterId: string;
  ownedCharacters: string[];
  ownedItems: string[];
  equippedItems: EquippedItems;
  powerups: {
    shield: number;
    magnet: number;
    speed: number;
    life: number;
  };
  achievements: Record<string, {
    progress: number;
    unlocked: boolean;
    claimed: boolean;
  }>;
  dailyReward: {
    lastClaimDate: string | null;
    consecutiveDays: number;
  };
  settings: {
    language: Language;
    sound: boolean;
    music: boolean;
    effects: boolean;
    vibration: boolean;
    graphics: 'high' | 'medium' | 'low';
  };
  tutorialCompleted: boolean;
  stats: {
    totalCoinsEarned: number;
    totalLevelsCompleted: number;
    totalItemsPurchased: number;
    totalPlayTimeSeconds: number;
  };
}
