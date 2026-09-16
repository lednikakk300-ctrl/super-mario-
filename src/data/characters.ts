import { CharacterDefinition } from '../types/game';

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: 'char_temur',
    name: {
      uz: 'Temur',
      en: 'Alex',
      ru: 'Тимур',
    },
    title: {
      uz: 'Jasur Sayohatchi',
      en: 'The Adventurer',
      ru: 'Храбрый Искатель',
    },
    description: {
      uz: 'Muvozanatli tezlik va chidamlilikka ega jasur yosh sarguzashtchi.',
      en: 'A balanced and agile explorer ready for any adventure.',
      ru: 'Сбалансированный и ловкий исследователь, готовый к любым испытаниям.',
    },
    price: 0, // Free starter
    speed: 5.5,
    jumpForce: 12.5,
    maxLives: 3,
    magnetRadius: 75,
    colors: {
      skin: '#F5D0A9',
      hair: '#4A2E18',
      eyes: '#2B1B10',
      shirt: '#3B82F6',
      pants: '#1E293B',
      shoes: '#DC2626',
    },
    specialTrait: {
      uz: 'Muvozanatli harakat va tez tiklanish',
      en: 'Balanced agility and quick recovery',
      ru: 'Сбалансированная маневренность',
    },
  },
  {
    id: 'char_rayhon',
    name: {
      uz: 'Rayhon',
      en: 'Luna',
      ru: 'Луна',
    },
    title: {
      uz: 'Soyalar Yuguruvchisi',
      en: 'Shadow Runner',
      ru: 'Бегущая в Тенях',
    },
    description: {
      uz: 'Juda tezkor va yengil sakrovchi shiddatli qahramon.',
      en: 'Incredibly swift with high jumps and rapid momentum.',
      ru: 'Невероятно быстрая героиня с высоким прыжком и ловкостью.',
    },
    price: 350,
    speed: 6.8,
    jumpForce: 13.8,
    maxLives: 3,
    magnetRadius: 90,
    colors: {
      skin: '#FCD34D',
      hair: '#EC4899',
      eyes: '#831843',
      shirt: '#8B5CF6',
      pants: '#4C1D95',
      shoes: '#EC4899',
    },
    specialTrait: {
      uz: '+25% tez yugurish va yuqori sakrash',
      en: '+25% sprint velocity and higher leap',
      ru: '+25% к скорости бега и высоте прыжка',
    },
  },
  {
    id: 'char_jasur',
    name: {
      uz: 'Jasur',
      en: 'Blaze',
      ru: 'Джасур',
    },
    title: {
      uz: 'Po‘lat Titan',
      en: 'Titan Knight',
      ru: 'Стальной Титан',
    },
    description: {
      uz: 'Mustahkam quvvat va 4 ta jon bilan xavfli to‘siqlarga bardosh bera oladi.',
      en: 'Tough warrior featuring extra vitality and heavy resistance.',
      ru: 'Мощный воин с повышенным здоровьем (4 жизни) и стойкостью.',
    },
    price: 750,
    speed: 5.2,
    jumpForce: 12.0,
    maxLives: 4,
    magnetRadius: 110,
    colors: {
      skin: '#E0AC69',
      hair: '#1F2937',
      eyes: '#111827',
      shirt: '#EF4444',
      pants: '#374151',
      shoes: '#F59E0B',
    },
    specialTrait: {
      uz: '4 ta jon va keng tanga magniti',
      en: '4 hearts capacity and wide coin magnet aura',
      ru: '4 жизни и увеличенный радиус притяжения монет',
    },
  },
  {
    id: 'char_yulduz',
    name: {
      uz: 'Yulduz',
      en: 'Nova',
      ru: 'Нова',
    },
    title: {
      uz: 'Kiber Sehrgar',
      en: 'Cyber Mystic',
      ru: 'Кибер-Мистик',
    },
    description: {
      uz: 'Gravitatsiyani boshqaruvchi afsonaviy kiber mutaxassis.',
      en: 'Legendary gravity-defying cyber champion with immense magnet radius.',
      ru: 'Легендарный кибер-герой, управляющий гравитацией и притяжением.',
    },
    price: 1200,
    speed: 6.2,
    jumpForce: 14.5,
    maxLives: 4,
    magnetRadius: 150,
    colors: {
      skin: '#FBCFE8',
      hair: '#06B6D4',
      eyes: '#0891B2',
      shirt: '#10B981',
      pants: '#047857',
      shoes: '#F43F5E',
    },
    specialTrait: {
      uz: 'Katta sakrash va ulkan tanga tortish kuchi',
      en: 'Super jump and massive magnetic field',
      ru: 'Супер-прыжок и гигантское магнитное поле',
    },
  },
];
