import { PlayerData } from '../types/game';

const STORAGE_KEY = 'adventure_quest_save_v1';

export const INITIAL_PLAYER_DATA: PlayerData = {
  coins: 100, // Starter bonus coins so player can test shop early!
  xp: 0,
  level: 1,
  highestUnlockedLevel: 1,
  completedLevels: {},
  selectedCharacterId: 'char_temur',
  ownedCharacters: ['char_temur'],
  ownedItems: ['top_cyber_jacket', 'bottom_blue_jeans', 'shoes_red_sneakers'], // Starting basic wardrobe
  equippedItems: {
    top: 'top_cyber_jacket',
    bottom: 'bottom_blue_jeans',
    shoes: 'shoes_red_sneakers',
  },
  powerups: {
    shield: 1,
    magnet: 1,
    speed: 0,
    life: 0,
  },
  achievements: {},
  dailyReward: {
    lastClaimDate: null,
    consecutiveDays: 0,
  },
  settings: {
    language: 'uz', // default to Uzbek as requested
    sound: true,
    music: true,
    effects: true,
    vibration: true,
    graphics: 'high',
  },
  tutorialCompleted: false,
  stats: {
    totalCoinsEarned: 100,
    totalLevelsCompleted: 0,
    totalItemsPurchased: 0,
    totalPlayTimeSeconds: 0,
  },
};

export function loadPlayerData(): PlayerData {
  if (typeof window === 'undefined') return INITIAL_PLAYER_DATA;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePlayerData(INITIAL_PLAYER_DATA);
      return INITIAL_PLAYER_DATA;
    }
    const parsed = JSON.parse(raw) as Partial<PlayerData>;
    return {
      ...INITIAL_PLAYER_DATA,
      ...parsed,
      settings: {
        ...INITIAL_PLAYER_DATA.settings,
        ...(parsed.settings || {}),
      },
      powerups: {
        ...INITIAL_PLAYER_DATA.powerups,
        ...(parsed.powerups || {}),
      },
      stats: {
        ...INITIAL_PLAYER_DATA.stats,
        ...(parsed.stats || {}),
      },
      equippedItems: {
        ...INITIAL_PLAYER_DATA.equippedItems,
        ...(parsed.equippedItems || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load player data, resetting to default', e);
    return INITIAL_PLAYER_DATA;
  }
}

export function savePlayerData(data: PlayerData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save player data', e);
  }
}

export function resetAllProgress(): PlayerData {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  const fresh = JSON.parse(JSON.stringify(INITIAL_PLAYER_DATA)) as PlayerData;
  savePlayerData(fresh);
  return fresh;
}

export const resetPlayerData = resetAllProgress;

export function calculatePlayerLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progressPercent: number } {
  // Base XP formula: Level = 1 + floor(sqrt(xp / 50))
  const level = 1 + Math.floor(Math.sqrt(Math.max(0, xp) / 60));
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 60;
  const nextLevelXp = Math.pow(level, 2) * 60;
  const xpInLevel = Math.max(0, xp - currentLevelBaseXp);
  const neededForNext = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.floor((xpInLevel / neededForNext) * 100));

  return {
    level,
    currentXp: xpInLevel,
    nextLevelXp: neededForNext,
    progressPercent,
  };
}
