import React from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Language } from '../../types/game';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface LevelCompleteModalProps {
  levelId: number;
  coins: number;
  bonus: number;
  xp: number;
  stars: number;
  language: Language;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onLevelsMap: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelId,
  coins,
  bonus,
  xp,
  stars,
  language,
  hasNextLevel,
  onNextLevel,
  onReplayLevel,
  onLevelsMap,
  onHome,
}) => {
  const totalCoins = coins + bonus;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-amber-500/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center gap-5 text-center animate-in fade-in zoom-in duration-300">
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'levelTitle')} {levelId}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-game text-white tracking-wide mt-1">
            {getTranslation(language, 'levelComplete')}
          </h2>
        </div>

        {/* 3 Animated Stars */}
        <div className="flex items-center gap-2 py-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`transform transition-all duration-500 ${
                s <= stars ? 'scale-110' : 'scale-90 opacity-30'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  s <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                    : 'text-slate-600 fill-slate-800'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Rewards Summary Card */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{getTranslation(language, 'coins')}:</span>
            <span className="font-mono font-bold text-amber-400">+{coins}</span>
          </div>

          {bonus > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400">{getTranslation(language, 'bonus')}:</span>
              <span className="font-mono font-bold text-emerald-400">+{bonus}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-400">{getTranslation(language, 'xp')}:</span>
            <span className="font-mono font-bold text-indigo-400">+{xp} XP</span>
          </div>

          <div className="w-full h-[1px] bg-slate-800 my-0.5" />

          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-white">{getTranslation(language, 'totalReward')}:</span>
            <span className="font-mono text-amber-300 text-base">+{totalCoins} coins</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {hasNextLevel && (
            <button
              id="btn-complete-next"
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <span>{getTranslation(language, 'nextLevel')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              id="btn-complete-replay"
              onClick={() => {
                sound.playClick();
                onReplayLevel();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'replay')}</span>
            </button>

            <button
              id="btn-complete-levels"
              onClick={() => {
                sound.playClick();
                onLevelsMap();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-700"
            >
              <span>{getTranslation(language, 'menuLevels')}</span>
            </button>

            <button
              id="btn-complete-home"
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center active:scale-95 transition-all border border-slate-700"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
