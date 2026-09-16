import React from 'react';
import { HelpCircle, ArrowRight, X, Shield, Zap, Sparkles, Navigation } from 'lucide-react';
import { Language } from '../../types/game';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface TutorialModalProps {
  language: Language;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ language, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-game text-white">
                {getTranslation(language, 'tutorialTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {getTranslation(language, 'tutorialDesc')}
              </p>
            </div>
          </div>

          <button
            id="btn-close-tutorial"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tutorial Guide Cards */}
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          {/* 1. Movement */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                {language === 'uz' && 'Boshqaruv (Harakat & Sakrash)'}
                {language === 'en' && 'Controls (Move & Jump)'}
                {language === 'ru' && 'Управление (Бег и прыжки)'}
              </div>
              <p className="text-slate-400 mt-1">
                {language === 'uz' && 'Kompyuterda: WASD yoki strelkalar (←, →, ↑), Bo‘sh joy (Space) sakrash uchun. Mobilda: ekrandagi qulay tugmalar.'}
                {language === 'en' && 'Desktop: WASD or Arrow keys (←, →, ↑), Spacebar to jump. Mobile: touch on-screen controls.'}
                {language === 'ru' && 'ПК: стрелки (←, →, ↑) или WASD, Пробел для прыжка. Смартфон: сенсорные кнопки на экране.'}
              </p>
            </div>
          </div>

          {/* 2. Collectibles & Objectives */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                {language === 'uz' && 'Tangalar va Topshiriqlar'}
                {language === 'en' && 'Coins & Mission Objectives'}
                {language === 'ru' && 'Монеты и цели миссии'}
              </div>
              <p className="text-slate-400 mt-1">
                {language === 'uz' && 'Har bir levelda belgilangan tanga va yashil yulduzlarni yig‘ing hamda finish portaliga yetib boring.'}
                {language === 'en' && 'Collect required coins & emerald gems in each stage, then reach the swirling finish portal.'}
                {language === 'ru' && 'Соберите необходимое количество монет и изумрудов, затем доберитесь до портала.'}
              </p>
            </div>
          </div>

          {/* 3. Hazards */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                {language === 'uz' && 'To‘siqlar va Jonlar'}
                {language === 'en' && 'Hazards & Hearts'}
                {language === 'ru' && 'Препятствия и жизни'}
              </div>
              <p className="text-slate-400 mt-1">
                {language === 'uz' && 'Tikanlar va aylanuvchi disklardan ehtiyot bo‘ling. Qalqon va qo‘shimcha yurak eliksirlaridan foydalaning.'}
                {language === 'en' && 'Avoid spikes and rotating circular saws. Equip shield and bonus heart potions for safety.'}
                {language === 'ru' && 'Остерегайтесь шипов и циркулярных пил. Используйте зелья щита для защиты.'}
              </p>
            </div>
          </div>

          {/* 4. Shop & Wardrobe */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                {language === 'uz' && 'Do‘kon va Kiyintirish'}
                {language === 'en' && 'Shop & Outfits'}
                {language === 'ru' && 'Магазин и гардероб'}
              </div>
              <p className="text-slate-400 mt-1">
                {language === 'uz' && 'Tangalaringizga yangi qahramonlar, kiyimlar va aksessuarlar sotib olib, xohlagancha kombinatsiya qiling.'}
                {language === 'en' && 'Spend coins to unlock unique heroes, stylish outfits, and equip your custom combinations.'}
                {language === 'ru' && 'Покупайте героев, костюмы и аксессуары на заработанные монеты и создавайте свой стиль.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="btn-tutorial-got-it"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm active:scale-95 transition-all shadow"
        >
          {language === 'uz' ? 'Tushunarli, boshladik!' : language === 'ru' ? 'Понятно, в бой!' : 'Got it, let\'s play!'}
        </button>
      </div>
    </div>
  );
};
