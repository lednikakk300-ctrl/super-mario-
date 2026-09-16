import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Check, Sparkles, AlertCircle, Shield, Magnet, Zap, Heart, Clock, Eye, Crown, Crosshair, Feather, Glasses, Wand2 } from 'lucide-react';
import { PlayerData, Language, ShopItem, ItemCategory } from '../../types/game';
import { SHOP_ITEMS } from '../../data/shopItems';
import { getTranslation } from '../../data/translations';
import { sound } from '../../utils/sound';

interface ShopProps {
  playerData: PlayerData;
  language: Language;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onBackToMenu: () => void;
}

export const Shop: React.FC<ShopProps> = ({
  playerData,
  language,
  onUpdatePlayerData,
  onBackToMenu,
}) => {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all' | 'sets'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const categories: { id: ItemCategory | 'all' | 'sets'; labelKey: string }[] = [
    { id: 'all', labelKey: 'shopAll' },
    { id: 'sets', labelKey: 'shopOutfits' },
    { id: 'top', labelKey: 'shopTop' },
    { id: 'bottom', labelKey: 'shopBottom' },
    { id: 'shoes', labelKey: 'shopShoes' },
    { id: 'hat', labelKey: 'shopHat' },
    { id: 'accessory', labelKey: 'shopAccessory' },
    { id: 'useful', labelKey: 'shopUseful' },
    { id: 'special', labelKey: 'shopSpecial' },
  ];

  // Filter items
  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'sets') return !!item.setId;
    return item.category === activeCategory;
  });

  const handleBuy = (item: ShopItem) => {
    // Check if consumable or already owned
    const isOwned = playerData.ownedItems.includes(item.id);
    if (!item.consumable && isOwned) {
      sound.playError();
      setErrorToast(getTranslation(language, 'alreadyOwned'));
      setTimeout(() => setErrorToast(null), 2500);
      return;
    }

    // Check coins balance
    if (playerData.coins < item.price) {
      sound.playError();
      setErrorToast(getTranslation(language, 'notEnoughCoins'));
      setTimeout(() => setErrorToast(null), 2500);
      return;
    }

    // Process Purchase
    sound.playPurchase();
    const updatedCoins = playerData.coins - item.price;
    const updatedOwnedItems = isOwned ? playerData.ownedItems : [...playerData.ownedItems, item.id];
    
    // Consumable powerup update
    const updatedPowerups = { ...playerData.powerups };
    if (item.effect) {
      const type = item.effect.type as 'shield' | 'magnet' | 'speed' | 'life';
      if (type in updatedPowerups) {
        updatedPowerups[type] = (updatedPowerups[type] || 0) + 1;
      }
    }

    // Update player stats and achievements
    const updatedStats = {
      ...playerData.stats,
      totalItemsPurchased: (playerData.stats.totalItemsPurchased || 0) + 1,
    };

    const updatedAchievements = { ...playerData.achievements };
    // Trigger shop buyer achievement
    if (updatedAchievements['ach_shop_buyer']) {
      updatedAchievements['ach_shop_buyer'].progress = 1;
      if (updatedAchievements['ach_shop_buyer'].progress >= 1) {
        updatedAchievements['ach_shop_buyer'].unlocked = true;
      }
    } else {
      updatedAchievements['ach_shop_buyer'] = { progress: 1, unlocked: true, claimed: false };
    }

    // Trigger fashion collector achievement
    const totalClothes = updatedOwnedItems.length;
    if (updatedAchievements['ach_fashion']) {
      updatedAchievements['ach_fashion'].progress = totalClothes;
      if (totalClothes >= 5) updatedAchievements['ach_fashion'].unlocked = true;
    } else {
      updatedAchievements['ach_fashion'] = { progress: totalClothes, unlocked: totalClothes >= 5, claimed: false };
    }

    onUpdatePlayerData({
      ...playerData,
      coins: updatedCoins,
      ownedItems: updatedOwnedItems,
      powerups: updatedPowerups,
      stats: updatedStats,
      achievements: updatedAchievements,
    });

    setSuccessToast(`${item.name[language]} ${getTranslation(language, 'purchased')}`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Helper icon renderer
  const renderItemIcon = (item: ShopItem) => {
    switch (item.iconName) {
      case 'Shield': return <Shield className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Magnet': return <Magnet className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Zap': return <Zap className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Heart': return <Heart className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Clock': return <Clock className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Crown': return <Crown className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Eye': return <Eye className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Crosshair': return <Crosshair className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Feather': return <Feather className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Glasses': return <Glasses className="w-8 h-8" style={{ color: item.colors.primary }} />;
      case 'Wand2': return <Wand2 className="w-8 h-8" style={{ color: item.colors.primary }} />;
      default:
        return (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow"
            style={{ backgroundColor: item.colors.primary }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-5 flex flex-col gap-5 select-none animate-in fade-in duration-300">
      {/* Top Bar with Back & Balance */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-shop-back"
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getTranslation(language, 'back')}</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full shadow">
          <span className="text-xs text-amber-400 font-semibold">{getTranslation(language, 'coins')}:</span>
          <span className="text-amber-300 font-mono font-bold text-base">
            {playerData.coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-900/30 via-slate-900 to-indigo-900/30 border border-amber-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-game text-white">
              {getTranslation(language, 'menuShop')}
            </h2>
            <p className="text-slate-400 text-xs">
              {language === 'uz' && '3 ta to‘liq set, alohida kiyimlar, aksessuarlar va kuchaytirgichlar.'}
              {language === 'en' && 'Mix & match 3 distinct outfit sets, accessories, and handy powerup elixirs.'}
              {language === 'ru' && 'Комбинируйте предметы из 3-х полных сетов, головные уборы и усилители.'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`shop-tab-${cat.id}`}
            onClick={() => {
              sound.playClick();
              setActiveCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm active:scale-95 ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {getTranslation(language, cat.labelKey as any)}
          </button>
        ))}
      </div>

      {/* Notifications / Toast */}
      {successToast && (
        <div className="w-full bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="w-full bg-rose-950/90 border border-rose-500 text-rose-200 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-lg animate-bounce">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isOwned = playerData.ownedItems.includes(item.id);
          const canAfford = playerData.coins >= item.price;
          const isConsumable = !!item.consumable;
          const currentCount = item.effect ? playerData.powerups[item.effect.type as keyof typeof playerData.powerups] || 0 : 0;

          return (
            <div
              key={item.id}
              id={`shop-item-${item.id}`}
              className={`relative rounded-2xl bg-slate-900/80 border p-4 flex flex-col justify-between gap-3 shadow-md transition-all hover:border-slate-600 ${
                isOwned && !isConsumable ? 'border-emerald-700/50 bg-emerald-950/10' : 'border-slate-800'
              }`}
            >
              {/* Set Tag badge if part of 3 sets */}
              {item.setId && (
                <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                  {item.setId.toUpperCase()}
                </div>
              )}

              {/* Icon / Visual representation */}
              <div className="w-full h-28 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center p-2">
                {renderItemIcon(item)}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>{item.name[language]}</span>
                  {isConsumable && (
                    <span className="text-xs text-slate-400 font-mono">
                      x{currentCount}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 min-h-[32px]">
                  {item.description[language]}
                </p>
              </div>

              {/* Bottom Buy / Owned Status */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-sm">
                  <span>{item.price}</span>
                  <span className="text-xs text-slate-400">coins</span>
                </div>

                {isOwned && !isConsumable ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {getTranslation(language, 'owned')}
                  </span>
                ) : (
                  <button
                    id={`btn-buy-${item.id}`}
                    onClick={() => handleBuy(item)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <span>{getTranslation(language, 'buy')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
