import { LevelDefinition, LocalizedText } from '../types/game';

interface WorldThemeConfig {
  id: number;
  theme: 'forest' | 'desert' | 'cyber' | 'volcano' | 'cosmic';
  name: LocalizedText;
  skyColorTop: string;
  skyColorBottom: string;
  groundColor: string;
  platformColor: string;
  accentColor: string;
}

export const WORLD_THEMES: Record<number, WorldThemeConfig> = {
  1: {
    id: 1,
    theme: 'forest',
    name: { uz: 'Zumrad O‘rmon', en: 'Emerald Forest', ru: 'Изумрудный Лес' },
    skyColorTop: '#064e3b',
    skyColorBottom: '#022c22',
    groundColor: '#15803d',
    platformColor: '#78350f',
    accentColor: '#4ade80',
  },
  2: {
    id: 2,
    theme: 'desert',
    name: { uz: 'Oltin Qumlik', en: 'Golden Dunes', ru: 'Золотые Дюны' },
    skyColorTop: '#78350f',
    skyColorBottom: '#451a03',
    groundColor: '#d97706',
    platformColor: '#b45309',
    accentColor: '#fbbf24',
  },
  3: {
    id: 3,
    theme: 'cyber',
    name: { uz: 'Kiber Shahar', en: 'Cyber Metropolis', ru: 'Кибер Город' },
    skyColorTop: '#0f172a',
    skyColorBottom: '#020617',
    groundColor: '#1e293b',
    platformColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
  4: {
    id: 4,
    theme: 'volcano',
    name: { uz: 'Vulqon Cho‘qqisi', en: 'Volcano Peak', ru: 'Пик Вулкана' },
    skyColorTop: '#450a0a',
    skyColorBottom: '#1c1917',
    groundColor: '#7f1d1d',
    platformColor: '#b91c1c',
    accentColor: '#f97316',
  },
  5: {
    id: 5,
    theme: 'cosmic',
    name: { uz: 'Kosmik Fazoviy', en: 'Cosmic Dimension', ru: 'Космическое Пространство' },
    skyColorTop: '#1e1b4b',
    skyColorBottom: '#030712',
    groundColor: '#4c1d95',
    platformColor: '#7c3aed',
    accentColor: '#c084fc',
  },
};

// Procedurally structured array of exactly 50 levels with calibrated scaling:
export const LEVELS: LevelDefinition[] = Array.from({ length: 50 }, (_, idx) => {
  const id = idx + 1;
  const worldId = Math.min(5, Math.floor(idx / 10) + 1);
  const worldTheme = WORLD_THEMES[worldId];
  const levelInWorld = (idx % 10) + 1;

  // Scaling metrics
  const targetCoins = 10 + Math.min(25, Math.floor(id * 0.45));
  const targetGems = id < 5 ? 1 : id < 25 ? 2 : 3;
  const timeLimit = Math.max(35, 75 - Math.floor(id * 0.55));
  const rewardCoins = 25 + id * 4;
  const bonusRewardCoins = 10 + id * 2;
  const rewardXp = 30 + id * 5;

  let difficulty: 'easy' | 'medium' | 'hard' | 'extreme' = 'easy';
  if (id > 35) difficulty = 'extreme';
  else if (id > 20) difficulty = 'hard';
  else if (id > 8) difficulty = 'medium';

  const name: LocalizedText = {
    uz: `${worldTheme.name.uz} - ${levelInWorld}-bosqich`,
    en: `${worldTheme.name.en} - Stage ${levelInWorld}`,
    ru: `${worldTheme.name.ru} - Этап ${levelInWorld}`,
  };

  return {
    id,
    worldId,
    worldName: worldTheme.name,
    theme: worldTheme.theme,
    name,
    difficulty,
    targetCoins,
    targetGems,
    timeLimit,
    rewardCoins,
    bonusRewardCoins,
    rewardXp,
    levelLength: 2200 + id * 40,
    objectives: [
      {
        id: `obj_coins_${id}`,
        type: 'coins',
        target: targetCoins,
        description: {
          uz: `${targetCoins} ta oltin tanga to‘plash`,
          en: `Collect ${targetCoins} gold coins`,
          ru: `Собрать ${targetCoins} золотых монет`,
        },
      },
      {
        id: `obj_gems_${id}`,
        type: 'gems',
        target: targetGems,
        description: {
          uz: `${targetGems} ta yulduzli toshni topish`,
          en: `Find ${targetGems} star crystals`,
          ru: `Найти ${targetGems} звездных кристалла`,
        },
      },
      {
        id: `obj_finish_${id}`,
        type: 'finish',
        target: 1,
        description: {
          uz: `Finish portaliga yetib borish`,
          en: `Reach the destination portal`,
          ru: `Добраться до финишного портала`,
        },
      },
    ],
  };
});
