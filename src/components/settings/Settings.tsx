import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Music, Globe, RotateCcw, AlertTriangle, Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { PlayerData, Language } from '../../types/game';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface SettingsProps {
  playerData: PlayerData;
  language: Language;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onResetProgress: () => void;
  onBackToMenu: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  playerData,
  language,
  onUpdatePlayerData,
  onResetProgress,
  onBackToMenu,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Toggle Sound
  const handleToggleSound = () => {
    const nextVal = !playerData.settings.sound;
    sound.setSoundEnabled(nextVal);
    sound.playClick();
    onUpdatePlayerData({
      ...playerData,
      settings: { ...playerData.settings, sound: nextVal },
    });
  };

  // Toggle Music
  const handleToggleMusic = () => {
    const nextVal = !playerData.settings.music;
    sound.setMusicEnabled(nextVal);
    sound.playClick();
    onUpdatePlayerData({
      ...playerData,
      settings: { ...playerData.settings, music: nextVal },
    });
  };

  // Change Language
  const handleChangeLanguage = (lang: Language) => {
    sound.playClick();
    onUpdatePlayerData({
      ...playerData,
      settings: { ...playerData.settings, language: lang },
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 flex flex-col gap-6 select-none animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-settings-back"
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getTranslation(language, 'back')}</span>
        </button>

        <h2 className="text-xl font-bold font-game text-white">
          {getTranslation(language, 'menuSettings')}
        </h2>
      </div>

      {saveToast && (
        <div className="w-full bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{getTranslation(language, 'settingsSaved')}</span>
        </div>
      )}

      {/* Settings Options Box */}
      <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col gap-6 shadow-xl">
        {/* 1. Language Selection */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{getTranslation(language, 'language')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { code: 'uz' as Language, label: "O'zbekcha", flag: '🇺🇿' },
              { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
              { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' },
            ].map((lang) => (
              <button
                key={lang.code}
                id={`btn-lang-${lang.code}`}
                onClick={() => handleChangeLanguage(lang.code)}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                  language === lang.code
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-indigo-500/25'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Audio Toggles */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              {playerData.settings.sound ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{getTranslation(language, 'sound')}</span>
            </div>

            <button
              id="toggle-sound-btn"
              onClick={handleToggleSound}
              className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
                playerData.settings.sound ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Music className={`w-4 h-4 ${playerData.settings.music ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{getTranslation(language, 'music')}</span>
            </div>

            <button
              id="toggle-music-btn"
              onClick={handleToggleMusic}
              className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center ${
                playerData.settings.music ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* 3. Reset Progress with Danger Confirmation */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{getTranslation(language, 'resetProgress')}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'uz' && 'Barcha level, tanga va buyumlarni dastlabki holatga qaytaradi.'}
                {language === 'en' && 'Resets all levels, coins, and purchased items to brand new.'}
                {language === 'ru' && 'Сбрасывает прогресс уровней, монет и купленных вещей.'}
              </p>
            </div>

            <button
              id="btn-trigger-reset"
              onClick={() => {
                sound.playClick();
                setShowResetConfirm(true);
              }}
              className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-bold active:scale-95 transition-all"
            >
              {getTranslation(language, 'resetProgress')}
            </button>
          </div>
        </div>

        {/* 4. Game Version & Credits */}
        <div className="text-center pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Adventure Quest 2.0 • Offline Ready</span>
          </div>
          <span>Automatic local storage persistence enabled</span>
        </div>
      </div>

      {/* DANGER CONFIRM MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-700/80 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold font-game text-white">
              {getTranslation(language, 'resetConfirmTitle')}
            </h3>

            <p className="text-xs text-slate-300">
              {getTranslation(language, 'resetConfirmDesc')}
            </p>

            <div className="w-full flex items-center gap-3 mt-2">
              <button
                id="btn-confirm-cancel"
                onClick={() => {
                  sound.playClick();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs active:scale-95 transition-all"
              >
                {getTranslation(language, 'cancel')}
              </button>

              <button
                id="btn-confirm-reset-now"
                onClick={() => {
                  sound.playClick();
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs active:scale-95 transition-all shadow-lg"
              >
                {getTranslation(language, 'resetProgress')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
