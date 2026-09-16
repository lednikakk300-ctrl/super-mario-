import { Achievement } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_level',
    title: {
      uz: 'Birinchi Qadam',
      en: 'First Steps',
      ru: 'Первый шаг',
    },
    description: {
      uz: '1-levelni muvaffaqiyatli yakunlang',
      en: 'Complete Level 1 successfully',
      ru: 'Успешно пройдите 1-й уровень',
    },
    target: 1,
    rewardCoins: 50,
    rewardXp: 50,
    icon: 'Flag',
  },
  {
    id: 'ach_coin_150',
    title: {
      uz: 'Tanga Yig‘uvchi',
      en: 'Coin Collector',
      ru: 'Сборщик монет',
    },
    description: {
      uz: 'Jami 150 ta oltin tanga to‘plang',
      en: 'Accumulate a total of 150 gold coins',
      ru: 'Соберите 150 золотых монет',
    },
    target: 150,
    rewardCoins: 75,
    rewardXp: 60,
    icon: 'Coins',
  },
  {
    id: 'ach_coin_500',
    title: {
      uz: 'Boy Sarguzashtchi',
      en: 'Treasure Hunter',
      ru: 'Искатель сокровищ',
    },
    description: {
      uz: 'Jami 500 ta oltin tanga to‘plang',
      en: 'Accumulate a total of 500 gold coins',
      ru: 'Соберите 500 золотых монет',
    },
    target: 500,
    rewardCoins: 200,
    rewardXp: 150,
    icon: 'Sparkles',
  },
  {
    id: 'ach_5_levels',
    title: {
      uz: 'Tajribali Sayohatchi',
      en: 'Seasoned Explorer',
      ru: 'Бывалый путник',
    },
    description: {
      uz: '5 ta levelni muvaffaqiyatli tugating',
      en: 'Beat 5 distinct adventure levels',
      ru: 'Пройдите 5 различных уровней',
    },
    target: 5,
    rewardCoins: 120,
    rewardXp: 100,
    icon: 'Compass',
  },
  {
    id: 'ach_10_levels',
    title: {
      uz: 'Usta O‘yinchi',
      en: 'Dungeon Master',
      ru: 'Мастер приключений',
    },
    description: {
      uz: '10 ta levelni muvaffaqiyatli tugating',
      en: 'Beat 10 distinct adventure levels',
      ru: 'Пройдите 10 различных уровней',
    },
    target: 10,
    rewardCoins: 250,
    rewardXp: 200,
    icon: 'Award',
  },
  {
    id: 'ach_25_levels',
    title: {
      uz: 'Afsona Yo‘li',
      en: 'Legend in the Making',
      ru: 'На пути к славе',
    },
    description: {
      uz: '25 ta levelni muvaffaqiyatli yakunlang',
      en: 'Beat 25 distinct adventure levels',
      ru: 'Пройдите 25 различных уровней',
    },
    target: 25,
    rewardCoins: 500,
    rewardXp: 400,
    icon: 'Flame',
  },
  {
    id: 'ach_50_levels',
    title: {
      uz: 'Mutlaq Chempion',
      en: 'Ultimate Champion',
      ru: 'Абсолютный чемпион',
    },
    description: {
      uz: 'Barcha 50 ta levelni zabt eting!',
      en: 'Conquer all 50 challenging levels!',
      ru: 'Покорите все 50 этапов игры!',
    },
    target: 50,
    rewardCoins: 1500,
    rewardXp: 1000,
    icon: 'Crown',
  },
  {
    id: 'ach_shop_buyer',
    title: {
      uz: 'Xaridor',
      en: 'First Splurge',
      ru: 'Первая покупка',
    },
    description: {
      uz: 'Do‘kondan ilk buyumni xarid qiling',
      en: 'Buy your first item from the Shop',
      ru: 'Купите первый предмет в магазине',
    },
    target: 1,
    rewardCoins: 60,
    rewardXp: 50,
    icon: 'ShoppingBag',
  },
  {
    id: 'ach_fashion',
    title: {
      uz: 'Moda Ixlosmandi',
      en: 'Style Icon',
      ru: 'Модник',
    },
    description: {
      uz: '5 xil kiyim yoki aksessuarga ega bo‘ling',
      en: 'Own 5 different clothes or accessories',
      ru: 'Соберите 5 предметов гардероба',
    },
    target: 5,
    rewardCoins: 150,
    rewardXp: 120,
    icon: 'Shirt',
  },
  {
    id: 'ach_all_characters',
    title: {
      uz: 'Barcha Qahramonlar',
      en: 'Full Squad',
      ru: 'Полная команда',
    },
    description: {
      uz: 'Barcha 4 ta qahramonni oching',
      en: 'Unlock all 4 playable heroes',
      ru: 'Разблокируйте всех 4 героев',
    },
    target: 4,
    rewardCoins: 600,
    rewardXp: 500,
    icon: 'Users',
  },
];
