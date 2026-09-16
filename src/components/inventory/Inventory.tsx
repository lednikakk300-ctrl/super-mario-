import React, { useState } from 'react';
import { ArrowLeft, Check, Layers, Sparkles, Shield, Magnet, Zap, Heart, Clock, ShoppingBag } from 'lucide-react';
import { PlayerData, Language, ItemCategory } from '../../types/game';
import { SHOP_ITEMS } from '../../data/shopItems';
import { getTranslation } from '../../data/translations';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { sound } from '../../utils/sound';

interface InventoryProps {
  playerData: PlayerData;
  language: Language;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onBackToMenu: () => void;
  onNavigateToShop: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  playerData,
  language,
  onUpdatePlayerData,
  onBackToMenu,
  onNavigateToShop,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'powerups'>('top');

  const categories: { id: ItemCategory | 'powerups'; labelKey: string }[] = [
    { id: 'top', labelKey: 'shopTop' },
    { id: 'bottom', labelKey: 'shopBottom' },
    { id: 'shoes', labelKey: 'shopShoes' },
    { id: 'hat', labelKey: 'shopHat' },
    { id: 'accessory', labelKey: 'shopAccessory' },
    { id: 'powerups', labelKey: 'powerups' },
  ];

  const handleToggleEquip = (itemId: string, category: ItemCategory) => {
    sound.playClick();
    const currentEquipped = playerData.equippedItems[category as keyof typeof playerData.equippedItems];
    const isCurrentlyEquipped = currentEquipped === itemId;

    const updatedEquipped = { ...playerData.equippedItems };
    if (isCurrentlyEquipped) {
      delete updatedEquipped[category as keyof typeof playerData.equippedItems];
    } else {
      updatedEquipped[category as keyof typeof playerData.equippedItems] = itemId;
    }

    onUpdatePlayerData({
      ...playerData,
      equippedItems: updatedEquipped,
    });
  };

  // Get owned items for selected equipment category
  const ownedItems = SHOP_ITEMS.filter(
    (item) => item.category === selectedCategory && playerData.ownedItems.includes(item.id)
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-5 flex flex-col gap-5 select-none animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-inventory-back"
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getTranslation(language, 'back')}</span>
        </button>

        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold">
          <Layers className="w-4 h-4" />
          <span>{playerData.ownedItems.length} {getTranslation(language, 'owned')}</span>
        </div>
      </div>

      {/* Main Wardrobe Grid */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left: Character Live Preview */}
        <div className="w-full md:w-72 rounded-3xl bg-slate-900/90 border border-indigo-500/30 p-5 flex flex-col items-center gap-4 shadow-xl">
          <div className="w-48 h-56 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-2 shadow-inner">
            <CharacterAvatar
              characterId={playerData.selectedCharacterId}
              equippedItems={playerData.equippedItems}
              size="lg"
              animate
            />
          </div>

          <div className="w-full flex flex-col gap-1.5 text-center">
            <span className="text-xs font-bold text-slate-300 font-game">
              {getTranslation(language, 'equipped')}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1">
              {(['top', 'bottom', 'shoes', 'hat', 'accessory'] as ItemCategory[]).map((cat) => {
                const eqId = playerData.equippedItems[cat as keyof typeof playerData.equippedItems];
                const item = SHOP_ITEMS.find((i) => i.id === eqId);
                return (
                  <span
                    key={cat}
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      item
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-500'
                    }`}
                  >
                    {item ? item.name[language] : cat}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Category Tabs & Items List */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`inv-tab-${cat.id}`}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {getTranslation(language, cat.labelKey as any)}
              </button>
            ))}
          </div>

          {/* Powerups Section */}
          {selectedCategory === 'powerups' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'shield', icon: <Shield className="w-5 h-5 text-blue-400" />, name: { uz: 'Qalqon Eliksiri', en: 'Shield Potion', ru: 'Зелье Щита' }, desc: { uz: 'Har bir levelda 1 marta to‘siq zarbasidan asraydi', en: 'Absorbs 1 hazard hit in level', ru: 'Поглощает 1 удар' } },
                { key: 'magnet', icon: <Magnet className="w-5 h-5 text-red-400" />, name: { uz: 'Katta Magnit', en: 'Mega Magnet', ru: 'Мега Магнит' }, desc: { uz: 'Yaqindagi barcha tangalarni tortadi', en: 'Attracts all nearby coins', ru: 'Притягивает все монеты' } },
                { key: 'speed', icon: <Zap className="w-5 h-5 text-amber-400" />, name: { uz: 'Shiddat Eliksiri', en: 'Speed Tonic', ru: 'Зелье Скорости' }, desc: { uz: '+25% yugurish tezligi', en: '+25% running velocity', ru: '+25% к скорости' } },
                { key: 'life', icon: <Heart className="w-5 h-5 text-rose-400" />, name: { uz: 'Qo‘shimcha Yurak', en: 'Extra Heart', ru: 'Лишнее Сердце' }, desc: { uz: '+1 ta qo‘shimcha jon', en: '+1 bonus heart container', ru: '+1 жизнь на уровень' } },
              ].map((p) => {
                const count = playerData.powerups[p.key as keyof typeof playerData.powerups] || 0;
                return (
                  <div key={p.key} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between gap-3 shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
                        {p.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{p.name[language]}</div>
                        <div className="text-xs text-slate-400">{p.desc[language]}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{getTranslation(language, 'count')}</div>
                      <div className="text-lg font-mono font-bold text-amber-400">x{count}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Clothes & Outfits Grid */
            <div>
              {ownedItems.length === 0 ? (
                <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col items-center justify-center text-center gap-3">
                  <p className="text-slate-400 text-sm max-w-sm">
                    {getTranslation(language, 'emptyInventory')}
                  </p>
                  <button
                    id="btn-inv-visit-shop"
                    onClick={() => {
                      sound.playClick();
                      onNavigateToShop();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{getTranslation(language, 'menuShop')}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ownedItems.map((item) => {
                    const isEquipped = playerData.equippedItems[item.category as keyof typeof playerData.equippedItems] === item.id;

                    return (
                      <div
                        key={item.id}
                        id={`inv-item-${item.id}`}
                        className={`rounded-2xl bg-slate-900/80 border p-4 flex flex-col justify-between gap-3 shadow transition-all ${
                          isEquipped ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white line-clamp-1">
                            {item.name[language]}
                          </span>
                          {item.setId && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                              {item.setId.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="w-full h-20 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow"
                            style={{ backgroundColor: item.colors.primary }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </div>
                        </div>

                        <button
                          id={`btn-inv-equip-${item.id}`}
                          onClick={() => handleToggleEquip(item.id, item.category)}
                          className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                          }`}
                        >
                          {isEquipped ? (
                            <span>{getTranslation(language, 'unequip')}</span>
                          ) : (
                            <span>{getTranslation(language, 'equip')}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
