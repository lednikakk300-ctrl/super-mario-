import { DailyRewardItem } from '../types/game';

export const DAILY_REWARDS: DailyRewardItem[] = [
  {
    day: 1,
    coins: 50,
    xp: 30,
  },
  {
    day: 2,
    coins: 100,
    xp: 50,
  },
  {
    day: 3,
    coins: 150,
    xp: 75,
    bonusItem: {
      id: 'useful_shield',
      name: {
        uz: 'Qalqon Eliksiri',
        en: 'Shield Potion',
        ru: 'Зелье Щита',
      },
    },
  },
  {
    day: 4,
    coins: 250,
    xp: 120,
  },
  {
    day: 5,
    coins: 350,
    xp: 180,
    bonusItem: {
      id: 'useful_magnet',
      name: {
        uz: 'Katta Tanga Magniti',
        en: 'Mega Magnet',
        ru: 'Мега Магнит',
      },
    },
  },
  {
    day: 6,
    coins: 500,
    xp: 250,
  },
  {
    day: 7,
    coins: 1000,
    xp: 500,
    bonusItem: {
      id: 'special_golden_aura',
      name: {
        uz: 'Oltin Qahramon Aurasi',
        en: 'Aura of Midas',
        ru: 'Аура Мидаса',
      },
    },
  },
];
