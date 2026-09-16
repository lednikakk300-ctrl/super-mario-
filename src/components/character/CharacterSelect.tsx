import React, { useState } from 'react';
import { ArrowLeft, Check, Users, Sparkles, Shield, Zap, Heart, Magnet, ShoppingBag } from 'lucide-react';
import { PlayerData, Language, CharacterDefinition, ItemCategory } from '../../types/game';
import { CHARACTERS } from '../../data/characters';
import { SHOP_ITEMS } from '../../data/shopItems';
import { getTranslation } from '../../data/translations';
import { CharacterAvatar } from './CharacterAvatar';
import { sound } from '../../utils/sound';

interface CharacterSelectProps {
  playerData: PlayerData;
  language: Language;
  onUpdatePlayerData: (updated: PlayerData) => void;
  onBackToMenu: () => void;
  onNavigateToShop: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  playerData,
  language,
  onUpdatePlayerData,
  onBackToMenu,
  onNavigateToShop,
}) => {
  const [activeTab, setActiveTab] = useState<'heroes' | 'wardrobe'>('heroes');
  const [wardrobeCategory, setWardrobeCategory] = useState<ItemCategory>('top');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected hero details
  const selectedCharacter = CHARACTERS.find((c) => c.id === playerData.selectedCharacterId) || CHARACTERS[0];

  // Character selection / purchase
  const handleHeroAction = (char: CharacterDefinition) => {
    const isOwned = playerData.ownedCharacters.includes(char.id);

    if (isOwned) {
      sound.playClick();
      onUpdatePlayerData({
        ...playerData,
        selectedCharacterId: char.id,
      });
      setToastMessage(`${char.name[language]} ${getTranslation(language, 'selected')}`);
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    // Purchase character
    if (playerData.coins < char.price) {
      sound.playError();
      setToastMessage(getTranslation(language, 'notEnoughCoins'));
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    sound.playPurchase();
    const updatedCoins = playerData.coins - char.price;
    const updatedOwnedChars = [...playerData.ownedCharacters, char.id];

    // Check achievement all characters
    const updatedAchievements = { ...playerData.achievements };
    if (updatedAchievements['ach_all_characters']) {
      updatedAchievements['ach_all_characters'].progress = updatedOwnedChars.length;
      if (updatedOwnedChars.length >= 4) updatedAchievements['ach_all_characters'].unlocked = true;
    } else {
      updatedAchievements['ach_all_characters'] = {
        progress: updatedOwnedChars.length,
        unlocked: updatedOwnedChars.length >= 4,
        claimed: false,
      };
    }

    onUpdatePlayerData({
      ...playerData,
      coins: updatedCoins,
      ownedCharacters: updatedOwnedChars,
      selectedCharacterId: char.id,
      achievements: updatedAchievements,
    });

    setToastMessage(`${char.name[language]} ${getTranslation(language, 'purchased')}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Equip / Unequip gear
  const handleToggleEquip = (itemId: string, category: ItemCategory) => {
    const currentEquipped = playerData.equippedItems[category as keyof typeof playerData.equippedItems];
    const isCurrentlyEquipped = currentEquipped === itemId;

    sound.playClick();
    const updatedEquipped = { ...playerData.equippedItems };
    if (isCurrentlyEquipped) {
      // Unequip
      delete updatedEquipped[category as keyof typeof playerData.equippedItems];
    } else {
      // Equip
      updatedEquipped[category as keyof typeof playerData.equippedItems] = itemId;
    }

    onUpdatePlayerData({
      ...playerData,
      equippedItems: updatedEquipped,
    });
  };

  // Filter owned wardrobe items by category
  const ownedWardrobeItems = SHOP_ITEMS.filter(
    (item) => item.category === wardrobeCategory && playerData.ownedItems.includes(item.id)
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-5 flex flex-col gap-5 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-character-back"
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{getTranslation(language, 'back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow">
            <span className="text-xs text-amber-400 font-semibold">{getTranslation(language, 'coins')}:</span>
            <span className="text-amber-300 font-mono font-bold text-sm">
              {playerData.coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Tabs: Heroes Roster vs Wardrobe Fitting Room */}
      <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow">
        <button
          id="tab-mode-heroes"
          onClick={() => {
            sound.playClick();
            setActiveTab('heroes');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
            activeTab === 'heroes'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{getTranslation(language, 'characterSelectTitle')}</span>
        </button>

        <button
          id="tab-mode-wardrobe"
          onClick={() => {
            sound.playClick();
            setActiveTab('wardrobe');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
            activeTab === 'wardrobe'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{getTranslation(language, 'inventoryTitle')}</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================= */}
      {/* 1. HEROES ROSTER TAB (4 CHARACTERS)       */}
      {/* ========================================= */}
      {activeTab === 'heroes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHARACTERS.map((char) => {
            const isOwned = playerData.ownedCharacters.includes(char.id);
            const isSelected = playerData.selectedCharacterId === char.id;
            const canAfford = playerData.coins >= char.price;

            return (
              <div
                key={char.id}
                id={`char-card-${char.id}`}
                className={`relative rounded-3xl bg-slate-900/90 border p-5 flex flex-col justify-between gap-4 shadow-xl transition-all ${
                  isSelected
                    ? 'border-purple-500 shadow-purple-500/20 bg-gradient-to-b from-purple-950/40 to-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active selection badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white shadow">
                    {getTranslation(language, 'selected')}
                  </div>
                )}

                {/* Character Avatar Showcase */}
                <div className="w-full h-44 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-center p-3">
                  <CharacterAvatar
                    characterId={char.id}
                    equippedItems={isSelected ? playerData.equippedItems : {}}
                    size="lg"
                    animate
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="font-extrabold text-lg text-white font-game">
                    {char.name[language]}
                  </h3>
                  <span className="text-xs font-semibold text-purple-300">
                    {char.title[language]}
                  </span>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {char.description[language]}
                  </p>
                </div>

                {/* Stats Attributes */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{getTranslation(language, 'speed')}: {Math.round(char.speed * 10)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{getTranslation(language, 'jumpForce')}: {Math.round(char.jumpForce)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-300">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{getTranslation(language, 'health')}: {char.maxLives}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Magnet className="w-3.5 h-3.5" />
                    <span>{getTranslation(language, 'magnet')}: {char.magnetRadius}</span>
                  </div>
                </div>

                {/* Action: Select or Buy */}
                <div>
                  {isOwned ? (
                    <button
                      id={`btn-select-char-${char.id}`}
                      onClick={() => handleHeroAction(char)}
                      disabled={isSelected}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow ${
                        isSelected
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 cursor-default'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-95 cursor-pointer'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{getTranslation(language, 'selected')}</span>
                        </>
                      ) : (
                        <span>{getTranslation(language, 'select')}</span>
                      )}
                    </button>
                  ) : (
                    <button
                      id={`btn-buy-char-${char.id}`}
                      onClick={() => handleHeroAction(char)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span>{getTranslation(language, 'buy')}</span>
                      <span className="font-mono">({char.price} coins)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================= */}
      {/* 2. WARDROBE FITTING ROOM TAB              */}
      {/* ========================================= */}
      {activeTab === 'wardrobe' && (
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left: Large Real-time Character Fitting Room Preview */}
          <div className="w-full lg:w-80 rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/30 p-6 flex flex-col items-center gap-4 shadow-xl">
            <h3 className="font-bold text-base text-white font-game">
              {selectedCharacter.name[language]}
            </h3>

            <div className="w-56 h-64 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-3 shadow-inner">
              <CharacterAvatar
                characterId={selectedCharacter.id}
                equippedItems={playerData.equippedItems}
                size="xl"
                animate
              />
            </div>

            <div className="w-full text-center">
              <div className="text-xs text-slate-400 font-semibold mb-2">
                {getTranslation(language, 'equipped')}:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {(['top', 'bottom', 'shoes', 'hat', 'accessory'] as ItemCategory[]).map((cat) => {
                  const eqId = playerData.equippedItems[cat as keyof typeof playerData.equippedItems];
                  const item = SHOP_ITEMS.find((i) => i.id === eqId);
                  return (
                    <span
                      key={cat}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/60 border-slate-700 text-slate-500'
                      }`}
                    >
                      {item ? item.name[language] : getTranslation(language, `shop${cat.charAt(0).toUpperCase() + cat.slice(1)}` as any)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Wardrobe Items by Category */}
          <div className="flex-1 w-full flex flex-col gap-4">
            {/* Category Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {(['top', 'bottom', 'shoes', 'hat', 'accessory'] as ItemCategory[]).map((cat) => (
                <button
                  key={cat}
                  id={`wardrobe-tab-${cat}`}
                  onClick={() => {
                    sound.playClick();
                    setWardrobeCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm active:scale-95 ${
                    wardrobeCategory === cat
                      ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {getTranslation(language, `shop${cat.charAt(0).toUpperCase() + cat.slice(1)}` as any)}
                </button>
              ))}
            </div>

            {/* Wardrobe Items Grid */}
            {ownedWardrobeItems.length === 0 ? (
              <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col items-center justify-center text-center gap-3">
                <p className="text-slate-400 text-sm max-w-sm">
                  {getTranslation(language, 'emptyInventory')}
                </p>
                <button
                  id="btn-wardrobe-go-shop"
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
                {ownedWardrobeItems.map((item) => {
                  const isEquipped = playerData.equippedItems[wardrobeCategory as keyof typeof playerData.equippedItems] === item.id;

                  return (
                    <div
                      key={item.id}
                      id={`wardrobe-item-${item.id}`}
                      className={`rounded-2xl bg-slate-900/80 border p-4 flex flex-col justify-between gap-3 shadow transition-all ${
                        isEquipped ? 'border-purple-500 bg-purple-950/20' : 'border-slate-800 hover:border-slate-700'
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
                        id={`btn-equip-${item.id}`}
                        onClick={() => handleToggleEquip(item.id, item.category)}
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer ${
                          isEquipped
                            ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
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
        </div>
      )}
    </div>
  );
};
