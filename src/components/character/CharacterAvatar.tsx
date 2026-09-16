import React from 'react';
import { CHARACTERS } from '../../data/characters';
import { SHOP_ITEMS } from '../../data/shopItems';
import { EquippedItems } from '../../types/game';

interface CharacterAvatarProps {
  characterId: string;
  equippedItems?: EquippedItems;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  equippedItems = {} as EquippedItems,
  size = 'md',
  animate = false,
  className = '',
}) => {
  const character = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];

  // Resolve equipped items colors & details
  const topItem = SHOP_ITEMS.find((i) => i.id === equippedItems.top);
  const bottomItem = SHOP_ITEMS.find((i) => i.id === equippedItems.bottom);
  const shoesItem = SHOP_ITEMS.find((i) => i.id === equippedItems.shoes);
  const hatItem = SHOP_ITEMS.find((i) => i.id === equippedItems.hat);
  const accessoryItem = SHOP_ITEMS.find((i) => i.id === equippedItems.accessory);

  const topColor = topItem?.colors.primary || character.colors.shirt;
  const topSecondary = topItem?.colors.secondary || '#1e3a8a';
  const bottomColor = bottomItem?.colors.primary || character.colors.pants;
  const bottomSecondary = bottomItem?.colors.secondary || '#0f172a';
  const shoesColor = shoesItem?.colors.primary || character.colors.shoes;
  const shoesSecondary = shoesItem?.colors.secondary || '#ffffff';

  const sizePixels = {
    sm: 48,
    md: 96,
    lg: 160,
    xl: 240,
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${animate ? 'hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
    >
      <svg
        viewBox="0 0 120 150"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Aura / Glow if special accessory */}
        {accessoryItem?.id === 'acc_flame_aura' && (
          <circle cx="60" cy="75" r="55" fill="none" stroke="#F97316" strokeWidth="4" opacity="0.6" strokeDasharray="6,4">
            <animateTransform attributeName="transform" type="rotate" from="0 60 75" to="360 60 75" dur="4s" repeatCount="indefinite" />
          </circle>
        )}
        {accessoryItem?.id === 'special_golden_aura' && (
          <circle cx="60" cy="75" r="55" fill="none" stroke="#FBBF24" strokeWidth="4" opacity="0.7">
            <animate attributeName="r" values="50;58;50" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Angel Wings / Phoenix Plumes in back */}
        {accessoryItem?.id === 'acc_angel_wings' && (
          <g opacity="0.95">
            <path d="M 40 60 C 10 30, 0 50, 5 80 C 15 90, 35 75, 45 70 Z" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="2" />
            <path d="M 80 60 C 110 30, 120 50, 115 80 C 105 90, 85 75, 75 70 Z" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="2" />
          </g>
        )}
        {accessoryItem?.id === 'special_phoenix_wings' && (
          <g opacity="0.95">
            <path d="M 40 60 C 5 20, -5 45, 5 85 C 15 95, 35 80, 45 70 Z" fill="#EF4444" stroke="#F97316" strokeWidth="3" />
            <path d="M 80 60 C 115 20, 125 45, 115 85 C 105 95, 85 80, 75 70 Z" fill="#EF4444" stroke="#F97316" strokeWidth="3" />
          </g>
        )}

        {/* Royal Cape in back */}
        {accessoryItem?.id === 'acc_royal_cape' && (
          <path d="M 38 65 L 26 130 L 94 130 L 82 65 Z" fill="#DC2626" stroke="#F59E0B" strokeWidth="2" />
        )}

        {/* Ninja Shuriken on back */}
        {accessoryItem?.id === 'acc_ninja_shuriken' && (
          <g transform="translate(60, 75) scale(0.6)">
            <path d="M 0 -35 L 8 -10 L 35 0 L 10 8 L 0 35 L -8 10 L -35 0 L -10 -8 Z" fill="#27272A" stroke="#A1A1AA" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#DC2626" />
          </g>
        )}

        {/* Companion Plasma Drone */}
        {accessoryItem?.id === 'acc_cyber_drone' && (
          <g transform="translate(95, 30)">
            <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="#38BDF8" />
            <line x1="-12" y1="-8" x2="12" y2="-8" stroke="#06B6D4" strokeWidth="2" />
            <animateTransform attributeName="transform" type="translate" values="95,26; 95,34; 95,26" dur="2s" repeatCount="indefinite" />
          </g>
        )}

        {/* Legs / Bottoms */}
        <g id="legs">
          {/* Left Leg */}
          <rect x="42" y="98" width="14" height="32" rx="4" fill={bottomColor} />
          {bottomSecondary && <line x1="42" y1="108" x2="56" y2="108" stroke={bottomSecondary} strokeWidth="2" />}
          {/* Right Leg */}
          <rect x="64" y="98" width="14" height="32" rx="4" fill={bottomColor} />
          {bottomSecondary && <line x1="64" y1="108" x2="78" y2="108" stroke={bottomSecondary} strokeWidth="2" />}
        </g>

        {/* Shoes */}
        <g id="shoes">
          {/* Left Shoe */}
          <path d="M 38 126 L 56 126 C 58 126, 58 136, 54 136 L 36 136 C 34 136, 34 126, 38 126 Z" fill={shoesColor} stroke={shoesSecondary} strokeWidth="1.5" />
          {/* Right Shoe */}
          <path d="M 64 126 L 82 126 C 86 126, 86 136, 84 136 L 66 136 C 62 136, 62 126, 64 126 Z" fill={shoesColor} stroke={shoesSecondary} strokeWidth="1.5" />
        </g>

        {/* Torso / Top */}
        <g id="torso">
          {/* Base Shirt/Chest */}
          <path
            d="M 36 60 L 84 60 C 88 60, 88 100, 80 100 L 40 100 C 32 100, 32 60, 36 60 Z"
            fill={topColor}
            stroke={topSecondary}
            strokeWidth="2"
          />

          {/* Special patterns for sets */}
          {topItem?.setId === 'set1' && (
            <line x1="42" y1="65" x2="78" y2="95" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          )}
          {topItem?.setId === 'set2' && (
            <path d="M 52 70 L 68 70 L 60 85 Z" fill="#F59E0B" />
          )}
          {topItem?.setId === 'set3' && (
            <line x1="45" y1="60" x2="75" y2="98" stroke="#DC2626" strokeWidth="3" />
          )}

          {/* Arms */}
          {/* Left Arm */}
          <rect x="25" y="62" width="12" height="34" rx="6" fill={topColor} />
          <circle cx="31" cy="98" r="6" fill={character.colors.skin} />

          {/* Right Arm */}
          <rect x="83" y="62" width="12" height="34" rx="6" fill={topColor} />
          <circle cx="89" cy="98" r="6" fill={character.colors.skin} />
        </g>

        {/* Neck & Head */}
        <g id="head">
          <rect x="52" y="48" width="16" height="15" fill={character.colors.skin} />
          {/* Head circle */}
          <circle cx="60" cy="38" r="22" fill={character.colors.skin} />

          {/* Hair */}
          <path
            d="M 38 34 C 38 16, 82 16, 82 34 C 82 24, 75 16, 60 16 C 45 16, 38 24, 38 34 Z"
            fill={character.colors.hair}
          />
          {/* Extra hair bangs */}
          <circle cx="48" cy="22" r="9" fill={character.colors.hair} />
          <circle cx="70" cy="22" r="9" fill={character.colors.hair} />

          {/* Eyes */}
          <ellipse cx="52" cy="38" rx="3" ry="4" fill={character.colors.eyes} />
          <circle cx="53" cy="37" r="1" fill="#FFFFFF" />
          <ellipse cx="68" cy="38" rx="3" ry="4" fill={character.colors.eyes} />
          <circle cx="69" cy="37" r="1" fill="#FFFFFF" />

          {/* Cheerful Smile */}
          <path d="M 54 46 Q 60 52 66 46" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Glasses Accessory */}
        {accessoryItem?.id === 'acc_neon_glasses' && (
          <g transform="translate(42, 34)">
            <rect x="0" y="0" width="16" height="8" rx="2" fill="#A855F7" opacity="0.85" stroke="#3B82F6" strokeWidth="1" />
            <rect x="20" y="0" width="16" height="8" rx="2" fill="#A855F7" opacity="0.85" stroke="#3B82F6" strokeWidth="1" />
            <line x1="16" y1="4" x2="20" y2="4" stroke="#3B82F6" strokeWidth="2" />
          </g>
        )}

        {/* Hats / Helmets */}
        {hatItem && (
          <g id="hat">
            {hatItem.id === 'hat_cyber_visor' && (
              <g transform="translate(40, 32)">
                <rect x="0" y="0" width="40" height="12" rx="3" fill="#06B6D4" opacity="0.9" stroke="#E0F2FE" strokeWidth="1.5" />
                <line x1="5" y1="6" x2="35" y2="6" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            )}

            {hatItem.id === 'hat_royal_helm' && (
              <g>
                <path d="M 38 34 C 38 14, 82 14, 82 34 L 78 44 L 42 44 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                {/* Plume */}
                <path d="M 60 14 C 60 0, 75 4, 80 16 Z" fill="#DC2626" />
              </g>
            )}

            {hatItem.id === 'hat_ninja_cowl' && (
              <g>
                <path d="M 36 34 C 36 12, 84 12, 84 34 L 84 52 L 36 52 Z" fill="#18181B" opacity="0.95" />
                {/* Eye slit cutout */}
                <rect x="46" y="34" width="28" height="10" rx="3" fill={character.colors.skin} />
                <ellipse cx="52" cy="38" rx="2" ry="3" fill={character.colors.eyes} />
                <ellipse cx="68" cy="38" rx="2" ry="3" fill={character.colors.eyes} />
                <line x1="42" y1="28" x2="78" y2="28" stroke="#DC2626" strokeWidth="3" />
              </g>
            )}

            {hatItem.id === 'hat_crown' && (
              <path d="M 40 24 L 46 10 L 53 18 L 60 6 L 67 18 L 74 10 L 80 24 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            )}

            {hatItem.id === 'hat_wizard_hat' && (
              <g>
                <ellipse cx="60" cy="24" rx="28" ry="6" fill="#6366F1" />
                <path d="M 44 22 L 60 -4 L 76 22 Z" fill="#4F46E5" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="60" cy="8" r="3" fill="#FBBF24" />
              </g>
            )}

            {hatItem.id === 'hat_adventure_cap' && (
              <g>
                <path d="M 38 28 C 38 16, 82 16, 82 28 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
                <path d="M 38 28 Q 24 28 20 32 Q 35 34 50 28" fill="#1D4ED8" />
              </g>
            )}

            {hatItem.id === 'hat_bandana' && (
              <g>
                <rect x="38" y="24" width="44" height="8" rx="2" fill="#EF4444" />
                <path d="M 80 26 L 94 36 L 82 34 Z" fill="#DC2626" />
              </g>
            )}
          </g>
        )}

        {/* Handheld staff or amulet */}
        {accessoryItem?.id === 'acc_magic_wand' && (
          <g transform="translate(18, 55)">
            <line x1="0" y1="45" x2="0" y2="0" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <polygon points="-6,-6 6,-6 0,-16" fill="#8B5CF6" />
            <circle cx="0" cy="-6" r="4" fill="#FCD34D" />
          </g>
        )}
      </svg>
    </div>
  );
};
