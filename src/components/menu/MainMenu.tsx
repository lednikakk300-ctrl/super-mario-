import React from 'react';
import { Play, Map, ShoppingBag, Users, Layers, Settings, Gift, Trophy, Sparkles } from 'lucide-react';
import { PlayerData, Language } from '../../types/game';
import { getTranslation } from '../../data/translations';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { sound } from '../../utils/sound';

interface MainMenuProps {
  playerData: PlayerData;
  language: Language;
  onNavigate: (tab: 'play' | 'levels' | 'shop' | 'character' | 'inventory' | 'settings' | 'achievements') => void;
  onQuickPlay: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  playerData,
  language,
  onNavigate,
  onQuickPlay,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6 animate-in fade-in duration-300">
      {/* Hero Showcase Card */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Avatar Preview */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-t from-slate-900 to-indigo-900/40 border border-indigo-500/40 flex items-center justify-center p-2 shadow-inner">
            <CharacterAvatar
              characterId={playerData.selectedCharacterId}
              equippedItems={playerData.equippedItems}
              size="lg"
              animate
            />
          </div>
          <span className="mt-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-700/50">
            Level {playerData.highestUnlockedLevel} / 50
          </span>
        </div>

        {/* Welcome & Quick Launch */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adventure Quest 2.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-game text-white tracking-tight drop-shadow-md">
            {getTranslation(language, 'gameTitle')}
          </h1>

          <p className="text-slate-300 text-sm max-w-md">
            {language === 'uz' && '50 ta level, to‘siqlar, qahramonlar va kiyimlar do‘koni. Sarguzashtni boshlang!'}
            {language === 'en' && 'Explore 50 challenging stages, unlock legendary gear, and build your hero squad!'}
            {language === 'ru' && 'Покорите 50 уникальных уровней, покупайте костюмы и прокачивайте героев!'}
          </p>

          {/* Quick Play Action Button */}
          <button
            id="btn-main-quick-play"
            onClick={() => {
              sound.playClick();
              onQuickPlay();
            }}
            className="mt-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-base tracking-wide flex items-center gap-3 shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer border-2 border-yellow-200/50"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{getTranslation(language, 'continueLevel')} #{playerData.highestUnlockedLevel}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Navigation (6 Key Sections) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* 1. PLAY / O‘YNASH */}
        <button
          id="nav-btn-play"
          onClick={() => {
            sound.playClick();
            onQuickPlay();
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-900/30 hover:from-emerald-800/50 hover:to-teal-800/40 border border-emerald-600/40 p-5 flex flex-col items-center text-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
            <Play className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-wide">
              {getTranslation(language, 'menuPlay')}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">
              Level #{playerData.highestUnlockedLevel}
            </div>
          </div>
        </button>

        {/* 2. LEVELS / LEVELlar */}
        <button
          id="nav-btn-levels"
          onClick={() => {
            sound.playClick();
            onNavigate('levels');
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-900/40 to-blue-900/30 hover:from-sky-800/50 hover:to-blue-800/40 border border-sky-600/40 p-5 flex flex-col items-center text-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-inner">
            <Map className="w-7 h-7" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-wide">
              {getTranslation(language, 'menuLevels')}
            </div>
            <div className="text-[11px] text-sky-300/80 mt-0.5">
              50 {getTranslation(language, 'level')}
            </div>
          </div>
        </button>

        {/* 3. SHOP / DO‘KON */}
        <button
          id="nav-btn-shop"
          onClick={() => {
            sound.playClick();
            onNavigate('shop');
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/40 to-orange-900/30 hover:from-amber-800/50 hover:to-orange-800/40 border border-amber-600/40 p-5 flex flex-col items-center text-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-inner">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-wide">
              {getTranslation(language, 'menuShop')}
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">
              3 Sets & Wardrobe
            </div>
          </div>
        </button>

        {/* 4. CHARACTER / QAHRAMON */}
        <button
          id="nav-btn-character"
          onClick={() => {
            sound.playClick();
            onNavigate('character');
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 to-violet-900/30 hover:from-purple-800/50 hover:to-violet-800/40 border border-purple-600/40 p-5 flex flex-col items-center text-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-wide">
              {getTranslation(language, 'menuCharacter')}
            </div>
            <div className="text-[11px] text-purple-300/80 mt-0.5">
              4 Heroes
            </div>
          </div>
        </button>

        {/* 5. INVENTORY / INVENTAR */}
        <button
          id="nav-btn-inventory"
          onClick={() => {
            sound.playClick();
            onNavigate('inventory');
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-cyan-900/30 hover:from-indigo-800/50 hover:to-cyan-800/40 border border-indigo-600/40 p-5 flex flex-col items-center text-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-wide">
              {getTranslation(language, 'menuInventory')}
            </div>
            <div className="text-[11px] text-indigo-300/80 mt-0.5">
              {playerData.ownedItems.length} {getTranslation(language, 'owned')}
            </div>
          </div>
        </button>

        {/* 6. SETTINGS / SOZLAMALAR */}
        <button
          id="nav-btn-settings"
          onClick={() => {
            sound.playClick();
            onNavigate('settings');
          }}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-700/60 hover:to-slate-800/60 border border-slate-700 p-5 flex flex-col items-center text-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-700/30 border border-slate-600 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform shadow-inner">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-wide">
              {getTranslation(language, 'menuSettings')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              3 Languages & Audio
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
