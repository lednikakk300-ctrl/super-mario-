import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Home, Shield, Zap, Magnet, Heart, Volume2, VolumeX, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { LevelDefinition, PlayerData, Language } from '../../types/game';
import { CHARACTERS } from '../../data/characters';
import { SHOP_ITEMS } from '../../data/shopItems';
import { WORLD_THEMES } from '../../data/levels';
import { sound } from '../../utils/sound';
import { getTranslation } from '../../data/translations';

interface GameCanvasProps {
  level: LevelDefinition;
  playerData: PlayerData;
  language: Language;
  onCompleteLevel: (result: { levelId: number; coins: number; bonus: number; xp: number; stars: number }) => void;
  onExitToMenu: () => void;
  onOpenSettings: () => void;
}

interface Collectible {
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'heart' | 'shield' | 'magnet';
  value: number;
  radius: number;
  collected: boolean;
  pulseOffset: number;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'solid' | 'bouncy' | 'moving';
  vx?: number;
  minX?: number;
  maxX?: number;
}

interface Hazard {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'saw' | 'lava';
  vx?: number;
  minX?: number;
  maxX?: number;
  angle?: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  playerData,
  language,
  onCompleteLevel,
  onExitToMenu,
  onOpenSettings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active character and bonuses
  const character = CHARACTERS.find((c) => c.id === playerData.selectedCharacterId) || CHARACTERS[0];
  
  // Consumed powerups for this run
  const hasShieldItem = (playerData.powerups.shield || 0) > 0;
  const hasMagnetItem = (playerData.powerups.magnet || 0) > 0;
  const hasSpeedItem = (playerData.powerups.speed || 0) > 0;
  const hasExtraLifeItem = (playerData.powerups.life || 0) > 0;

  // Real-time HUD states
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [lives, setLives] = useState(character.maxLives + (hasExtraLifeItem ? 1 : 0));
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [shieldActive, setShieldActive] = useState(hasShieldItem);
  const [magnetActive] = useState(hasMagnetItem);
  const [isPaused, setIsPaused] = useState(false);
  const [gameResult, setGameResult] = useState<'playing' | 'won' | 'lost'>('playing');
  const [failReason, setFailReason] = useState<string>('');

  // World Theme
  const worldTheme = WORLD_THEMES[level.worldId] || WORLD_THEMES[1];

  // Game Engine State (Refs for high performance 60fps loop)
  const engineRef = useRef({
    player: {
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
      width: 36,
      height: 52,
      isGrounded: false,
      facing: 1, // 1 right, -1 left
      invulnerableTimer: 0,
      speed: character.speed * (hasSpeedItem ? 1.25 : 1),
      jumpForce: character.jumpForce,
      magnetRadius: character.magnetRadius * (hasMagnetItem ? 2.0 : 1),
    },
    camera: { x: 0, y: 0 },
    keys: { left: false, right: false, up: false },
    platforms: [] as Platform[],
    collectibles: [] as Collectible[],
    hazards: [] as Hazard[],
    portal: { x: level.levelLength - 180, y: 320, width: 60, height: 90 },
    coins: 0,
    gems: 0,
    lives: character.maxLives + (hasExtraLifeItem ? 1 : 0),
    shieldActive: hasShieldItem,
    animFrameId: 0,
    lastTime: performance.now(),
    timerAcc: 0,
    levelDuration: level.timeLimit,
    ended: false,
  });

  // Level Generator
  const initLevel = useCallback(() => {
    const len = level.levelLength;
    const floorY = 440;
    const platforms: Platform[] = [];
    const collectibles: Collectible[] = [];
    const hazards: Hazard[] = [];

    // Main floor segments with periodic pits
    let currX = 0;
    while (currX < len) {
      const pit = currX > 300 && currX < len - 300 && Math.random() < 0.28;
      if (pit) {
        // Pit / hazard beneath
        hazards.push({
          x: currX,
          y: floorY + 40,
          width: 140,
          height: 60,
          type: level.theme === 'volcano' ? 'lava' : 'spike',
        });
        currX += 140;
      } else {
        const segWidth = 240 + Math.floor(Math.random() * 200);
        platforms.push({
          x: currX,
          y: floorY,
          width: segWidth,
          height: 80,
          type: 'solid',
        });
        currX += segWidth;
      }
    }

    // Elevated platforms & bouncy pads
    for (let x = 250; x < len - 260; x += 180 + Math.floor(Math.random() * 120)) {
      const platY = 220 + Math.floor(Math.random() * 160);
      const isBouncy = Math.random() < 0.25;
      const isMoving = !isBouncy && Math.random() < 0.35;

      platforms.push({
        x,
        y: platY,
        width: 110 + Math.floor(Math.random() * 60),
        height: 22,
        type: isBouncy ? 'bouncy' : isMoving ? 'moving' : 'solid',
        vx: isMoving ? (Math.random() > 0.5 ? 1.5 : -1.5) : 0,
        minX: Math.max(50, x - 100),
        maxX: Math.min(len - 50, x + 100),
      });

      // Place collectibles above platforms
      if (Math.random() < 0.8) {
        collectibles.push({
          x: x + 40,
          y: platY - 35,
          type: 'coin',
          value: 1,
          radius: 12,
          collected: false,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
      if (Math.random() < 0.4) {
        collectibles.push({
          x: x + 80,
          y: platY - 35,
          type: 'coin',
          value: 1,
          radius: 12,
          collected: false,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Distribute star gems along the level
    const gemInterval = Math.floor(len / (level.targetGems + 1));
    for (let g = 1; g <= level.targetGems; g++) {
      collectibles.push({
        x: g * gemInterval + Math.floor(Math.random() * 60),
        y: 190 + (g % 2) * 50,
        type: 'gem',
        value: 1,
        radius: 16,
        collected: false,
        pulseOffset: g,
      });
    }

    // Distribute remaining required coins across the level
    const numCoinsToScatter = Math.max(level.targetCoins + 8, 20);
    const coinStep = Math.floor(len / numCoinsToScatter);
    for (let c = 0; c < numCoinsToScatter; c++) {
      const cx = 150 + c * coinStep + Math.floor(Math.random() * 40);
      collectibles.push({
        x: cx,
        y: floorY - 35 - (c % 3 === 0 ? 70 : 0),
        type: 'coin',
        value: 1,
        radius: 12,
        collected: false,
        pulseOffset: c * 0.4,
      });
    }

    // Distribute scattered hazards
    for (let h = 400; h < len - 300; h += 280 + Math.floor(Math.random() * 180)) {
      const isMovingHazard = level.difficulty !== 'easy' && Math.random() < 0.45;
      hazards.push({
        x: h,
        y: floorY - 26,
        width: 32,
        height: 26,
        type: isMovingHazard ? 'saw' : 'spike',
        vx: isMovingHazard ? (Math.random() > 0.5 ? 1.8 : -1.8) : 0,
        minX: h - 80,
        maxX: h + 80,
        angle: 0,
      });
    }

    // In-level pickable shield or heart
    if (Math.random() < 0.7) {
      collectibles.push({
        x: len * 0.45,
        y: 200,
        type: 'heart',
        value: 1,
        radius: 14,
        collected: false,
        pulseOffset: 0,
      });
    }
    if (Math.random() < 0.6) {
      collectibles.push({
        x: len * 0.7,
        y: 200,
        type: 'shield',
        value: 1,
        radius: 14,
        collected: false,
        pulseOffset: 1,
      });
    }

    engineRef.current = {
      player: {
        x: 100,
        y: 300,
        vx: 0,
        vy: 0,
        width: 36,
        height: 52,
        isGrounded: false,
        facing: 1,
        invulnerableTimer: 0,
        speed: character.speed * (hasSpeedItem ? 1.25 : 1),
        jumpForce: character.jumpForce,
        magnetRadius: character.magnetRadius * (hasMagnetItem ? 2.0 : 1),
      },
      camera: { x: 0, y: 0 },
      keys: { left: false, right: false, up: false },
      platforms,
      collectibles,
      hazards,
      portal: { x: len - 160, y: floorY - 90, width: 60, height: 90 },
      coins: 0,
      gems: 0,
      lives: character.maxLives + (hasExtraLifeItem ? 1 : 0),
      shieldActive: hasShieldItem,
      animFrameId: 0,
      lastTime: performance.now(),
      timerAcc: 0,
      levelDuration: level.timeLimit,
      ended: false,
    };

    setCoinsCollected(0);
    setGemsCollected(0);
    setLives(character.maxLives + (hasExtraLifeItem ? 1 : 0));
    setTimeLeft(level.timeLimit);
    setShieldActive(hasShieldItem);
    setGameResult('playing');
    setFailReason('');
  }, [level, character, hasExtraLifeItem, hasShieldItem, hasSpeedItem, hasMagnetItem]);

  // Restart level handler
  const handleRestart = () => {
    setIsPaused(false);
    initLevel();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        engineRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        engineRef.current.keys.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        engineRef.current.keys.up = true;
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        engineRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        engineRef.current.keys.right = false;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        engineRef.current.keys.up = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    initLevel();

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport dimensions
    const updateCanvasSize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Main Engine Step
    const loop = (currentTime: number) => {
      const engine = engineRef.current;
      const dt = Math.min((currentTime - engine.lastTime) / 1000, 0.1);
      engine.lastTime = currentTime;

      if (!isPaused && !engine.ended && ctx && canvas) {
        // --- 1. Countdown Timer ---
        engine.timerAcc += dt;
        if (engine.timerAcc >= 1) {
          engine.timerAcc -= 1;
          engine.levelDuration -= 1;
          setTimeLeft(engine.levelDuration);

          if (engine.levelDuration <= 0) {
            // Time up!
            engine.ended = true;
            sound.playHurt();
            setFailReason(getTranslation(language, 'failedReasonTime'));
            setGameResult('lost');
          }
        }

        // --- 2. Player Physics & Movement ---
        const player = engine.player;
        const keys = engine.keys;

        // Horizontal velocity
        if (keys.left) {
          player.vx = -player.speed;
          player.facing = -1;
        } else if (keys.right) {
          player.vx = player.speed;
          player.facing = 1;
        } else {
          player.vx *= 0.78; // Friction
        }

        // Gravity
        player.vy += 28 * dt; // Gravity
        if (player.vy > 18) player.vy = 18; // Terminal velocity

        // Jump
        if (keys.up && player.isGrounded) {
          player.vy = -player.jumpForce;
          player.isGrounded = false;
          sound.playJump();
        }

        // Apply velocities
        player.x += player.vx;
        player.y += player.vy;
        player.isGrounded = false;

        // Invulnerability countdown
        if (player.invulnerableTimer > 0) {
          player.invulnerableTimer -= dt;
        }

        // Boundaries
        if (player.x < 20) player.x = 20;
        if (player.x > level.levelLength - 40) player.x = level.levelLength - 40;

        // Pit death check
        if (player.y > 650) {
          engine.ended = true;
          sound.playHurt();
          setFailReason(getTranslation(language, 'failedReasonFall'));
          setGameResult('lost');
        }

        // --- 3. Platform Collisions & Moving Platforms ---
        for (const plat of engine.platforms) {
          if (plat.type === 'moving' && plat.vx && plat.minX !== undefined && plat.maxX !== undefined) {
            plat.x += plat.vx;
            if (plat.x < plat.minX || plat.x > plat.maxX) {
              plat.vx *= -1;
            }
          }

          // Check landing on top of platform
          const prevY = player.y - player.vy;
          if (
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height >= plat.y &&
            prevY + player.height <= plat.y + 12 &&
            player.vy >= 0
          ) {
            player.y = plat.y - player.height;
            player.vy = 0;
            player.isGrounded = true;

            if (plat.type === 'bouncy') {
              player.vy = -player.jumpForce * 1.45;
              sound.playJump();
            } else if (plat.type === 'moving' && plat.vx) {
              player.x += plat.vx; // Carry player
            }
          }
        }

        // --- 4. Hazards & Saw Collisions ---
        for (const hazard of engine.hazards) {
          if (hazard.vx && hazard.minX !== undefined && hazard.maxX !== undefined) {
            hazard.x += hazard.vx;
            if (hazard.x < hazard.minX || hazard.x > hazard.maxX) {
              hazard.vx *= -1;
            }
          }

          // Check overlap
          if (
            player.invulnerableTimer <= 0 &&
            player.x + player.width > hazard.x + 4 &&
            player.x < hazard.x + hazard.width - 4 &&
            player.y + player.height > hazard.y + 4 &&
            player.y < hazard.y + hazard.height
          ) {
            // Hazard hit
            if (engine.shieldActive) {
              // Shield absorbed!
              engine.shieldActive = false;
              setShieldActive(false);
              player.invulnerableTimer = 1.2;
              player.vy = -8;
              sound.playUnlock();
            } else {
              // Damage taken
              engine.lives -= 1;
              setLives(engine.lives);
              player.invulnerableTimer = 1.4;
              player.vy = -9;
              sound.playHurt();

              if (engine.lives <= 0) {
                engine.ended = true;
                setFailReason(getTranslation(language, 'failedReasonHazard'));
                setGameResult('lost');
              }
            }
          }
        }

        // --- 5. Collectibles & Magnetism ---
        for (const item of engine.collectibles) {
          if (item.collected) continue;

          // Magnet suction
          const dx = (player.x + player.width / 2) - item.x;
          const dy = (player.y + player.height / 2) - item.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (item.type === 'coin' && dist < player.magnetRadius) {
            const pullSpeed = 9;
            item.x += (dx / dist) * pullSpeed;
            item.y += (dy / dist) * pullSpeed;
          }

          // Pickup check
          if (dist < item.radius + 24) {
            item.collected = true;

            if (item.type === 'coin') {
              engine.coins += 1;
              setCoinsCollected(engine.coins);
              sound.playCoin();
            } else if (item.type === 'gem') {
              engine.gems += 1;
              setGemsCollected(engine.gems);
              sound.playGem();
            } else if (item.type === 'shield') {
              engine.shieldActive = true;
              setShieldActive(true);
              sound.playUnlock();
            } else if (item.type === 'heart') {
              engine.lives = Math.min(engine.lives + 1, 5);
              setLives(engine.lives);
              sound.playCoin();
            }
          }
        }

        // --- 6. Portal / Finish Check ---
        const portal = engine.portal;
        if (
          player.x + player.width > portal.x &&
          player.x < portal.x + portal.width &&
          player.y + player.height > portal.y &&
          player.y < portal.y + portal.height
        ) {
          // Check if core objectives met
          const hasCoinsTarget = engine.coins >= level.targetCoins;
          const hasGemsTarget = engine.gems >= level.targetGems;

          if (hasCoinsTarget && hasGemsTarget) {
            engine.ended = true;
            sound.playWin();

            // Trigger Victory Confetti
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {}

            // Calculate Stars (1-3)
            let stars = 1;
            if (engine.coins >= level.targetCoins + 5 && engine.gems >= level.targetGems) stars = 2;
            if (engine.coins >= level.targetCoins + 10 && engine.lives === character.maxLives) stars = 3;

            // Total reward
            const earnedCoins = level.rewardCoins + engine.coins;
            const bonusCoins = stars === 3 ? level.bonusRewardCoins * 2 : stars === 2 ? level.bonusRewardCoins : 0;
            const earnedXp = level.rewardXp + stars * 15;

            setGameResult('won');
            onCompleteLevel({
              levelId: level.id,
              coins: earnedCoins,
              bonus: bonusCoins,
              xp: earnedXp,
              stars,
            });
          }
        }

        // --- 7. Smooth Camera Tracking ---
        const targetCamX = player.x - canvas.width * 0.35;
        engine.camera.x += (targetCamX - engine.camera.x) * 0.1;
        if (engine.camera.x < 0) engine.camera.x = 0;
        if (engine.camera.x > level.levelLength - canvas.width) {
          engine.camera.x = Math.max(0, level.levelLength - canvas.width);
        }
      }

      // --- 8. Render Canvas Scene ---
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, worldTheme.skyColorTop);
        skyGrad.addColorStop(1, worldTheme.skyColorBottom);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Parallax Mountain Silhouettes
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        for (let i = 0; i < 10; i++) {
          const mountainX = (i * 380) - (engine.camera.x * 0.2) % 380;
          ctx.beginPath();
          ctx.moveTo(mountainX - 200, canvas.height);
          ctx.lineTo(mountainX, canvas.height - 240);
          ctx.lineTo(mountainX + 200, canvas.height);
          ctx.fill();
        }

        ctx.save();
        ctx.translate(-engine.camera.x, 0);

        // Render Platforms
        for (const plat of engine.platforms) {
          if (plat.x + plat.width < engine.camera.x || plat.x > engine.camera.x + canvas.width) continue;

          if (plat.type === 'bouncy') {
            ctx.fillStyle = '#10B981';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#34D399';
            ctx.fillRect(plat.x + 4, plat.y + 2, plat.width - 8, 4);
          } else if (plat.type === 'moving') {
            ctx.fillStyle = '#0284C7';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#38BDF8';
            ctx.fillRect(plat.x, plat.y, plat.width, 3);
          } else {
            ctx.fillStyle = worldTheme.platformColor;
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = worldTheme.accentColor;
            ctx.fillRect(plat.x, plat.y, plat.width, 4);
          }
        }

        // Render Hazards
        for (const haz of engine.hazards) {
          if (haz.x + haz.width < engine.camera.x || haz.x > engine.camera.x + canvas.width) continue;

          if (haz.type === 'spike') {
            ctx.fillStyle = '#DC2626';
            const numSpikes = Math.floor(haz.width / 12);
            for (let s = 0; s < numSpikes; s++) {
              ctx.beginPath();
              ctx.moveTo(haz.x + s * 12, haz.y + haz.height);
              ctx.lineTo(haz.x + s * 12 + 6, haz.y);
              ctx.lineTo(haz.x + (s + 1) * 12, haz.y + haz.height);
              ctx.fill();
            }
          } else if (haz.type === 'saw') {
            ctx.save();
            ctx.translate(haz.x + haz.width / 2, haz.y + haz.height / 2);
            ctx.rotate(currentTime * 0.008);
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(0, 0, haz.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (haz.type === 'lava') {
            ctx.fillStyle = '#EA580C';
            ctx.fillRect(haz.x, haz.y, haz.width, haz.height);
            ctx.fillStyle = '#FBBF24';
            ctx.fillRect(haz.x, haz.y, haz.width, 6);
          }
        }

        // Render Collectibles
        for (const item of engine.collectibles) {
          if (item.collected) continue;
          if (item.x + item.radius < engine.camera.x || item.x - item.radius > engine.camera.x + canvas.width) continue;

          const floatY = item.y + Math.sin(currentTime * 0.005 + item.pulseOffset) * 5;

          if (item.type === 'coin') {
            // Shiny rotating gold coin
            ctx.save();
            ctx.translate(item.x, floatY);
            const scaleX = Math.abs(Math.cos(currentTime * 0.004 + item.pulseOffset));
            ctx.scale(Math.max(0.2, scaleX), 1);
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(0, 0, item.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#D97706';
            ctx.fillRect(-2, -6, 4, 12);
            ctx.restore();
          } else if (item.type === 'gem') {
            // Sparkling emerald star gem
            ctx.save();
            ctx.translate(item.x, floatY);
            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.moveTo(0, -item.radius);
            ctx.lineTo(item.radius, 0);
            ctx.lineTo(0, item.radius);
            ctx.lineTo(-item.radius, 0);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#6EE7B7';
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (item.type === 'heart') {
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(item.x - 4, floatY, 6, 0, Math.PI * 2);
            ctx.arc(item.x + 4, floatY, 6, 0, Math.PI * 2);
            ctx.lineTo(item.x, floatY + 10);
            ctx.fill();
          } else if (item.type === 'shield') {
            ctx.fillStyle = '#3B82F6';
            ctx.beginPath();
            ctx.arc(item.x, floatY, 10, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Render Portal / Finish Line
        const portal = engine.portal;
        const portalPulse = Math.sin(currentTime * 0.006) * 6;
        const pGrad = ctx.createLinearGradient(portal.x, portal.y, portal.x + portal.width, portal.y + portal.height);
        pGrad.addColorStop(0, '#8B5CF6');
        pGrad.addColorStop(0.5, '#EC4899');
        pGrad.addColorStop(1, '#06B6D4');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.ellipse(portal.x + portal.width / 2, portal.y + portal.height / 2, portal.width / 2 + portalPulse, portal.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Portal rings
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(portal.x + portal.width / 2, portal.y + portal.height / 2, portal.width / 2 * 0.6, portal.height / 2 * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Render Hero Player Sprite
        const player = engine.player;
        const topItem = SHOP_ITEMS.find((i) => i.id === playerData.equippedItems.top);
        const bottomItem = SHOP_ITEMS.find((i) => i.id === playerData.equippedItems.bottom);
        const shoesItem = SHOP_ITEMS.find((i) => i.id === playerData.equippedItems.shoes);
        const hatItem = SHOP_ITEMS.find((i) => i.id === playerData.equippedItems.hat);

        const shirtColor = topItem?.colors.primary || character.colors.shirt;
        const pantsColor = bottomItem?.colors.primary || character.colors.pants;
        const shoeColor = shoesItem?.colors.primary || character.colors.shoes;

        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.scale(player.facing, 1);

        // Flash opacity if invulnerable
        if (player.invulnerableTimer > 0 && Math.floor(currentTime / 80) % 2 === 0) {
          ctx.globalAlpha = 0.4;
        }

        // Shield Bubble Aura if active
        if (engine.shieldActive) {
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 36, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fill();
        }

        // Legs / Pants
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-12, 6, 9, 18);
        ctx.fillRect(3, 6, 9, 18);

        // Shoes
        ctx.fillStyle = shoeColor;
        ctx.fillRect(-14, 20, 12, 6);
        ctx.fillRect(3, 20, 12, 6);

        // Torso / Shirt
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-14, -12, 28, 20);

        // Head
        ctx.fillStyle = character.colors.skin;
        ctx.beginPath();
        ctx.arc(0, -22, 13, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = character.colors.hair;
        ctx.beginPath();
        ctx.arc(0, -25, 13, Math.PI, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = character.colors.eyes;
        ctx.fillRect(3, -24, 3, 4);

        // Hat
        if (hatItem) {
          ctx.fillStyle = hatItem.colors.primary;
          ctx.fillRect(-14, -34, 28, 8);
        }

        ctx.restore();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [initLevel, isPaused, level, character, worldTheme, playerData.equippedItems, language, onCompleteLevel]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] flex flex-col bg-slate-950 select-none overflow-hidden">
      {/* Top Floating In-Game HUD */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Hearts & Shield */}
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-4 h-4 transition-transform ${
                  idx < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-600 opacity-40 scale-90'
                }`}
              />
            ))}
          </div>
          {shieldActive && (
            <div className="flex items-center gap-1 text-cyan-400 font-semibold text-xs border-l border-slate-700 pl-2">
              <Shield className="w-3.5 h-3.5 fill-cyan-400" />
            </div>
          )}
          {magnetActive && (
            <div className="flex items-center gap-1 text-rose-400 font-semibold text-xs border-l border-slate-700 pl-2">
              <Magnet className="w-3.5 h-3.5 fill-rose-400" />
            </div>
          )}
        </div>

        {/* Center: Objectives Tracker */}
        <div className="hidden sm:flex items-center gap-4 bg-slate-900/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/60 shadow-lg text-xs font-semibold pointer-events-auto">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>{coinsCollected} / {level.targetCoins}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rotate-45 bg-emerald-400"></span>
            <span>{gemsCollected} / {level.targetGems}</span>
          </div>
          <div className="text-slate-300 font-mono">
            ⏱ {timeLeft}s
          </div>
        </div>

        {/* Right: Pause & Sound Quick Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="btn-game-sound-toggle"
            onClick={() => {
              const next = !playerData.settings.sound;
              sound.setSoundEnabled(next);
              sound.setMusicEnabled(next);
              playerData.settings.sound = next;
              playerData.settings.music = next;
            }}
            className="w-9 h-9 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-200 flex items-center justify-center active:scale-90 transition-transform shadow-md"
            title="Toggle Sound"
          >
            {playerData.settings.sound ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            id="btn-game-pause"
            onClick={() => {
              sound.playClick();
              setIsPaused(true);
            }}
            className="w-9 h-9 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-amber-300 flex items-center justify-center active:scale-90 transition-transform shadow-md"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full flex-1 touch-none" />

      {/* Mobile Touch Controls Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none md:opacity-40 hover:opacity-100 transition-opacity">
        {/* Left & Right D-pad Buttons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            id="btn-touch-left"
            onTouchStart={() => { engineRef.current.keys.left = true; }}
            onTouchEnd={() => { engineRef.current.keys.left = false; }}
            onMouseDown={() => { engineRef.current.keys.left = true; }}
            onMouseUp={() => { engineRef.current.keys.left = false; }}
            className="w-14 h-14 rounded-2xl bg-slate-900/85 active:bg-cyan-600/80 border border-slate-600 text-white flex items-center justify-center active:scale-90 transition-all shadow-xl backdrop-blur-md"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>

          <button
            id="btn-touch-right"
            onTouchStart={() => { engineRef.current.keys.right = true; }}
            onTouchEnd={() => { engineRef.current.keys.right = false; }}
            onMouseDown={() => { engineRef.current.keys.right = true; }}
            onMouseUp={() => { engineRef.current.keys.right = false; }}
            className="w-14 h-14 rounded-2xl bg-slate-900/85 active:bg-cyan-600/80 border border-slate-600 text-white flex items-center justify-center active:scale-90 transition-all shadow-xl backdrop-blur-md"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>

        {/* Big Jump Button */}
        <div className="pointer-events-auto">
          <button
            id="btn-touch-jump"
            onTouchStart={() => { engineRef.current.keys.up = true; }}
            onTouchEnd={() => { engineRef.current.keys.up = false; }}
            onMouseDown={() => { engineRef.current.keys.up = true; }}
            onMouseUp={() => { engineRef.current.keys.up = false; }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 active:from-amber-600 active:to-yellow-500 text-slate-950 font-bold flex flex-col items-center justify-center active:scale-90 transition-transform shadow-2xl border-2 border-white/40"
          >
            <ArrowUp className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* PAUSE MODAL */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold font-game text-amber-400 tracking-wider">
              {getTranslation(language, 'pause')}
            </h2>
            <p className="text-slate-400 text-sm">
              {level.name[language]}
            </p>

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                id="btn-pause-resume"
                onClick={() => {
                  sound.playClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Play className="w-5 h-5 fill-current" />
                {getTranslation(language, 'resume')}
              </button>

              <button
                id="btn-pause-restart"
                onClick={() => {
                  sound.playClick();
                  handleRestart();
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                {getTranslation(language, 'restart')}
              </button>

              <button
                id="btn-pause-settings"
                onClick={() => {
                  sound.playClick();
                  onOpenSettings();
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-700"
              >
                {getTranslation(language, 'menuSettings')}
              </button>

              <button
                id="btn-pause-exit"
                onClick={() => {
                  sound.playClick();
                  onExitToMenu();
                }}
                className="w-full py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all border border-rose-800/40"
              >
                <Home className="w-4 h-4" />
                {getTranslation(language, 'exitToMenu')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL FAILED MODAL */}
      {gameResult === 'lost' && (
        <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-700/80 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-game text-rose-400 tracking-wider">
              {getTranslation(language, 'levelFailed')}
            </h2>

            {failReason && (
              <p className="text-slate-300 text-sm bg-slate-800/70 px-4 py-2 rounded-xl border border-slate-700">
                {failReason}
              </p>
            )}

            <div className="w-full flex items-center justify-around py-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 text-xs">
              <div>
                <div className="text-slate-400">{getTranslation(language, 'coins')}</div>
                <div className="text-base font-bold text-amber-400">{coinsCollected}</div>
              </div>
              <div>
                <div className="text-slate-400">{getTranslation(language, 'objectiveGems')}</div>
                <div className="text-base font-bold text-emerald-400">{gemsCollected} / {level.targetGems}</div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                id="btn-fail-retry"
                onClick={() => {
                  sound.playClick();
                  handleRestart();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                {getTranslation(language, 'retry')}
              </button>

              <button
                id="btn-fail-home"
                onClick={() => {
                  sound.playClick();
                  onExitToMenu();
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-700"
              >
                <Home className="w-4 h-4" />
                {getTranslation(language, 'home')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
