import React from 'react';
import { Trophy, Check, X, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerData, Language } from '../../types/game';
import { ACHIEVEMENTS } from '../../data/achievements';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface AchievementsModalProps {
  playerData: PlayerData;
  language: Language;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  playerData,
  language,
  onUpdatePlayerData,
  onClose,
}) => {
  const handleClaim = (achId: string, rewardCoins: number, rewardXp: number) => {
    sound.playWin();
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}

    const updatedAchievements = { ...playerData.achievements };
    if (updatedAchievements[achId]) {
      updatedAchievements[achId].claimed = true;
    }

    onUpdatePlayerData({
      ...playerData,
      coins: playerData.coins + rewardCoins,
      xp: playerData.xp + rewardXp,
      achievements: updatedAchievements,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 w-full max-w-xl max-h-[85vh] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-game text-white">
                {getTranslation(language, 'achievementsTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'uz' && 'Topshiriqlarni bajaring va mukofotlarni oling!'}
                {language === 'en' && 'Complete milestones to earn bonus coins and XP!'}
                {language === 'ru' && 'Выполняйте испытания и получайте награды!'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-achievements"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list of achievements */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const userAch = playerData.achievements[ach.id] || { progress: 0, unlocked: false, claimed: false };
            const progress = Math.min(userAch.progress, ach.target);
            const percent = Math.round((progress / ach.target) * 100);
            const isUnlocked = userAch.unlocked || progress >= ach.target;
            const isClaimed = userAch.claimed;

            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-3.5 border flex items-center justify-between gap-3 ${
                  isClaimed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                  {ach.icon}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {ach.title[language]}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400">
                      +{ach.rewardCoins} coins
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {ach.description[language]}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                <div className="shrink-0">
                  {isClaimed ? (
                    <span className="text-[11px] font-bold text-slate-500 px-2.5 py-1 rounded-lg bg-slate-800/60">
                      Claimed
                    </span>
                  ) : isUnlocked ? (
                    <button
                      id={`btn-claim-ach-${ach.id}`}
                      onClick={() => handleClaim(ach.id, ach.rewardCoins, ach.rewardXp)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs active:scale-95 shadow cursor-pointer animate-pulse"
                    >
                      {getTranslation(language, 'claimReward')}
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">
                      {progress}/{ach.target}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
