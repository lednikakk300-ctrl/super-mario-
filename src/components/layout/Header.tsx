import React from 'react';
import { Settings, Gift, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { PlayerData, Language } from '../../types/game';
import { calculatePlayerLevel } from '../../utils/storage';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { sound } from '../../utils/sound';

interface HeaderProps {
  playerData: PlayerData;
  language: Language;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenDailyReward: () => void;
  onOpenAchievements: () => void;
  onSelectCharacterTab: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  playerData,
  language,
  onOpenSettings,
  onOpenTutorial,
  onOpenDailyReward,
  onOpenAchievements,
  onSelectCharacterTab,
}) => {
  const { level, currentXp, nextLevelXp, progressPercent } = calculatePlayerLevel(playerData.xp);

  // Check if daily reward can be claimed today
  const todayDate = new Date().toISOString().split('T')[0];
  const isDailyRewardAvailable = playerData.dailyReward.lastClaimDate !== todayDate;

  // Check if any achievement is unlocked but not claimed
  const hasClaimableAchievements = Object.values(playerData.achievements || {}).some(
    (a: { unlocked?: boolean; claimed?: boolean }) => Boolean(a?.unlocked && !a?.claimed)
  );

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md select-none sticky top-0 z-30">
      {/* Left: Player Profile & Level Progress */}
      <div
        id="btn-header-profile"
        onClick={() => {
          sound.playClick();
          onSelectCharacterTab();
        }}
        className="flex items-center gap-2.5 cursor-pointer group"
        title="View Character Profile"
      >
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 p-1 flex items-center justify-center overflow-hidden group-hover:border-indigo-400 transition-colors">
          <CharacterAvatar
            characterId={playerData.selectedCharacterId}
            equippedItems={playerData.equippedItems}
            size="sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
            Lv{level}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <span className="text-amber-400 font-game">XP</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {currentXp}/{nextLevelXp}
            </span>
          </div>
          <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-1">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center: Gold Coin Counter */}
      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow-inner">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-yellow-200 flex items-center justify-center shadow animate-coin">
          <span className="text-xs font-black text-amber-950">$</span>
        </div>
        <span className="text-amber-300 font-bold font-mono text-sm sm:text-base tracking-wide">
          {playerData.coins.toLocaleString()}
        </span>
      </div>

      {/* Right: Action Buttons (Daily Reward, Achievements, Tutorial, Settings) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Daily Reward Button with notification badge */}
        <button
          id="btn-header-daily"
          onClick={() => {
            sound.playClick();
            onOpenDailyReward();
          }}
          className="relative w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          title="Daily Reward"
        >
          <Gift className="w-4 h-4 text-emerald-400" />
          {isDailyRewardAvailable && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
          )}
          {isDailyRewardAvailable && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-slate-900" />
          )}
        </button>

        {/* Achievements Button */}
        <button
          id="btn-header-achievements"
          onClick={() => {
            sound.playClick();
            onOpenAchievements();
          }}
          className="relative w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          title="Achievements"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          {hasClaimableAchievements && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-slate-900 animate-bounce" />
          )}
        </button>

        {/* Tutorial Button */}
        <button
          id="btn-header-tutorial"
          onClick={() => {
            sound.playClick();
            onOpenTutorial();
          }}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          title="How to Play"
        >
          <HelpCircle className="w-4 h-4 text-sky-400" />
        </button>

        {/* Settings Button */}
        <button
          id="btn-header-settings"
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center active:scale-90 transition-all shadow-sm"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
};
