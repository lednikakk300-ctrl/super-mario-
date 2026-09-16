import React, { useState } from 'react';
import { Lock, Star, CheckCircle2, Play, Sparkles, ArrowLeft, AlertCircle, Trophy } from 'lucide-react';
import { LevelDefinition, PlayerData, Language } from '../../types/game';
import { LEVELS, WORLD_THEMES } from '../../data/levels';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface LevelMapProps {
  playerData: PlayerData;
  language: Language;
  onSelectLevel: (level: LevelDefinition) => void;
  onBackToMenu: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  playerData,
  language,
  onSelectLevel,
  onBackToMenu,
}) => {
  // Active World Tab (1 to 5)
  const currentWorldId = Math.min(5, Math.floor((playerData.highestUnlockedLevel - 1) / 10) + 1);
  const [selectedWorld, setSelectedWorld] = useState<number>(currentWorldId);
  const [previewLevel, setPreviewLevel] = useState<LevelDefinition | null>(null);
  const [shakeLevelId, setShakeLevelId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const worldTheme = WORLD_THEMES[selectedWorld] || WORLD_THEMES[1];
  const levelsInWorld = LEVELS.filter((l) => l.worldId === selectedWorld);

  const handleLevelClick = (level: LevelDefinition) => {
    const isUnlocked = level.id <= playerData.highestUnlockedLevel;
    if (!isUnlocked) {
      sound.playError();
      setShakeLevelId(level.id);
      setErrorMessage(getTranslation(language, 'levelLockedMsg'));
      setTimeout(() => setShakeLevelId(null), 500);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    sound.playClick();
    setPreviewLevel(level);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5 flex flex-col gap-5 select-none animate-in fade-in duration-300">
      {/* Top Bar with Back Button and World Info */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-levels-back"
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getTranslation(language, 'back')}</span>
        </button>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            {getTranslation(language, 'world')} {selectedWorld} / 5
          </div>
          <h2 className="text-xl font-bold font-game text-white">
            {worldTheme.name[language]}
          </h2>
        </div>
      </div>

      {/* World Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[1, 2, 3, 4, 5].map((wId) => {
          const theme = WORLD_THEMES[wId];
          const isCurrent = selectedWorld === wId;
          const isWorldUnlocked = playerData.highestUnlockedLevel >= (wId - 1) * 10 + 1;

          return (
            <button
              key={wId}
              id={`tab-world-${wId}`}
              onClick={() => {
                sound.playClick();
                setSelectedWorld(wId);
              }}
              className={`flex-1 min-w-[130px] px-3 py-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 active:scale-95 shadow-sm ${
                isCurrent
                  ? 'bg-slate-800 border-amber-400/80 text-amber-300 shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {!isWorldUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
                <span>W{wId}: {theme.name[language].split(' ')[0]}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Lv {(wId - 1) * 10 + 1} - {wId * 10}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="w-full bg-rose-950/80 border border-rose-600/60 text-rose-200 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-bounce shadow-md">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 10-Level Adventure Map Grid / Path */}
      <div className="relative w-full rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl overflow-hidden">
        {/* Themed background tint */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${worldTheme.accentColor}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6">
          {levelsInWorld.map((lvl) => {
            const isUnlocked = lvl.id <= playerData.highestUnlockedLevel;
            const completedData = playerData.completedLevels[lvl.id];
            const isCompleted = !!completedData;
            const isCurrentNext = lvl.id === playerData.highestUnlockedLevel;
            const isShaking = shakeLevelId === lvl.id;

            return (
              <button
                key={lvl.id}
                id={`level-node-${lvl.id}`}
                onClick={() => handleLevelClick(lvl)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer group select-none active:scale-90 ${
                  isShaking ? 'animate-shake border-rose-500 bg-rose-950/40' : ''
                } ${
                  isCurrentNext
                    ? 'bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : isCompleted
                    ? 'bg-gradient-to-b from-emerald-950/50 to-slate-900/60 border-emerald-600/50 hover:border-emerald-400'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-950/60 border-slate-800/70 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Node Top Badge / Star Indicator */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-game font-extrabold text-lg shadow-md transition-transform group-hover:scale-110 mb-2">
                  {!isUnlocked ? (
                    <div className="w-full h-full rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-500 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                  ) : isCurrentNext ? (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg border border-yellow-200 animate-pulse">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                </div>

                {/* Level Number */}
                <span className="font-bold text-sm text-white">
                  {getTranslation(language, 'levelTitle')} {lvl.id}
                </span>

                {/* Stars earned (if completed) or reward teaser */}
                {isCompleted ? (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= (completedData.stars || 1)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono mt-1">
                    <span>+{lvl.rewardCoins}</span>
                    <span className="text-[10px] text-slate-400">coins</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LEVEL PREVIEW MODAL */}
      {previewLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                  {worldTheme.name[language]}
                </span>
                <h3 className="text-2xl font-bold font-game text-white">
                  {previewLevel.name[language]}
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 capitalize">
                {previewLevel.difficulty}
              </div>
            </div>

            {/* Objectives Box */}
            <div className="flex flex-col gap-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {getTranslation(language, 'objectives')}:
              </span>
              {previewLevel.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{obj.description[language]}</span>
                </div>
              ))}
            </div>

            {/* Rewards Teaser */}
            <div className="flex items-center justify-around py-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <div className="text-center">
                <div className="text-[11px] text-amber-300 font-semibold">{getTranslation(language, 'coins')}</div>
                <div className="text-lg font-bold text-amber-400 font-mono">+{previewLevel.rewardCoins}</div>
              </div>
              <div className="w-[1px] h-8 bg-amber-500/20" />
              <div className="text-center">
                <div className="text-[11px] text-indigo-300 font-semibold">{getTranslation(language, 'xp')}</div>
                <div className="text-lg font-bold text-indigo-400 font-mono">+{previewLevel.rewardXp}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-1">
              <button
                id="btn-preview-cancel"
                onClick={() => {
                  sound.playClick();
                  setPreviewLevel(null);
                }}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm active:scale-95 transition-all"
              >
                {getTranslation(language, 'cancel')}
              </button>

              <button
                id="btn-preview-start"
                onClick={() => {
                  sound.playClick();
                  const targetLvl = previewLevel;
                  setPreviewLevel(null);
                  onSelectLevel(targetLvl);
                }}
                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{getTranslation(language, 'menuPlay')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
