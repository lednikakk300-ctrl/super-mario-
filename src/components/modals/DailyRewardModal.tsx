import React from 'react';
import { Gift, Check, Sparkles, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerData, Language } from '../../types/game';
import { DAILY_REWARDS } from '../../data/dailyRewards';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface DailyRewardModalProps {
  playerData: PlayerData;
  language: Language;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onClose: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  playerData,
  language,
  onUpdatePlayerData,
  onClose,
}) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const isAvailableToday = playerData.dailyReward.lastClaimDate !== todayDate;
  const currentStreak = playerData.dailyReward.consecutiveDays || 0; // 0 to 6
  const nextRewardDay = (currentStreak % 7) + 1; // 1 to 7

  const handleClaimReward = () => {
    if (!isAvailableToday) return;

    sound.playWin();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    const rewardConfig = DAILY_REWARDS.find((r) => r.day === nextRewardDay) || DAILY_REWARDS[0];
    const updatedCoins = playerData.coins + rewardConfig.coins;
    
    // Add bonus powerups if applicable
    const updatedPowerups = { ...playerData.powerups };
    if (rewardConfig.bonusItem) {
      if (rewardConfig.bonusItem.id === 'useful_shield') {
        updatedPowerups.shield = (updatedPowerups.shield || 0) + 1;
      } else if (rewardConfig.bonusItem.id === 'useful_magnet') {
        updatedPowerups.magnet = (updatedPowerups.magnet || 0) + 1;
      }
    }

    const updatedDaily = {
      lastClaimDate: todayDate,
      consecutiveDays: currentStreak + 1,
    };

    onUpdatePlayerData({
      ...playerData,
      coins: updatedCoins,
      xp: playerData.xp + rewardConfig.xp,
      powerups: updatedPowerups,
      dailyReward: updatedDaily,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-600/60 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-game text-white">
                {getTranslation(language, 'dailyRewardTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {getTranslation(language, 'streak')}: {currentStreak} {language === 'uz' ? 'kun' : language === 'ru' ? 'дней' : 'days'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-daily"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {DAILY_REWARDS.map((reward) => {
            const isClaimed = !isAvailableToday ? reward.day <= nextRewardDay : reward.day < nextRewardDay;
            const isToday = isAvailableToday && reward.day === nextRewardDay;

            return (
              <div
                key={reward.day}
                className={`rounded-2xl p-2.5 flex flex-col items-center justify-between text-center gap-1.5 border transition-all ${
                  isToday
                    ? 'bg-gradient-to-b from-amber-500/20 to-yellow-500/20 border-amber-400 shadow-lg scale-105'
                    : isClaimed
                    ? 'bg-slate-950/60 border-emerald-600/40 opacity-70'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {getTranslation(language, 'day')} {reward.day}
                </span>

                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-sm shadow-inner">
                  {isClaimed ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span>{reward.bonusItem ? '🎁' : '🪙'}</span>
                  )}
                </div>

                <div className="font-bold text-[11px] text-amber-400 font-mono">
                  +{reward.coins}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div>
          {isAvailableToday ? (
            <button
              id="btn-claim-daily"
              onClick={handleClaimReward}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>{getTranslation(language, 'claimReward')}</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-slate-800 text-slate-400 text-xs font-semibold text-center border border-slate-700">
              {getTranslation(language, 'alreadyClaimedToday')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
