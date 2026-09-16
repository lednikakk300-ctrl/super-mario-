import React, { useState, useEffect } from 'react';
import { PlayerData, LevelDefinition, Language } from './types/game';
import { loadPlayerData, savePlayerData, resetPlayerData } from './utils/storage';
import { LEVELS } from './data/levels';
import { sound } from './utils/sound';
import { Header } from './components/layout/Header';
import { MainMenu } from './components/menu/MainMenu';
import { LevelMap } from './components/levels/LevelMap';
import { GameCanvas } from './components/gameplay/GameCanvas';
import { Shop } from './components/shop/Shop';
import { CharacterSelect } from './components/character/CharacterSelect';
import { Inventory } from './components/inventory/Inventory';
import { Settings } from './components/settings/Settings';
import { DailyRewardModal } from './components/modals/DailyRewardModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { LevelCompleteModal } from './components/modals/LevelCompleteModal';

export default function App() {
  const [playerData, setPlayerData] = useState<PlayerData>(() => loadPlayerData());
  const [currentView, setCurrentView] = useState<
    'menu' | 'levels' | 'gameplay' | 'shop' | 'character' | 'inventory' | 'settings'
  >('menu');

  // Currently playing level
  const [activeLevel, setActiveLevel] = useState<LevelDefinition | null>(null);

  // Active Modals
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [completedLevelData, setCompletedLevelData] = useState<{
    levelId: number;
    coins: number;
    bonus: number;
    xp: number;
    stars: number;
  } | null>(null);

  // Save changes to LocalStorage whenever playerData updates
  const handleUpdatePlayerData = (updated: PlayerData) => {
    setPlayerData(updated);
    savePlayerData(updated);
  };

  // Synchronize audio settings on start
  useEffect(() => {
    sound.setSoundEnabled(playerData.settings.sound);
    sound.setMusicEnabled(playerData.settings.music);
  }, [playerData.settings]);

  // Start a specific level
  const handleStartLevel = (level: LevelDefinition) => {
    setActiveLevel(level);
    setCurrentView('gameplay');
  };

  // Quick Play (Continue at highest unlocked level)
  const handleQuickPlay = () => {
    const targetLvl = LEVELS.find((l) => l.id === playerData.highestUnlockedLevel) || LEVELS[0];
    handleStartLevel(targetLvl);
  };

  // Level Won / Completed handler
  const handleLevelCompleted = (result: {
    levelId: number;
    coins: number;
    bonus: number;
    xp: number;
    stars: number;
  }) => {
    const totalCoinsEarned = result.coins + result.bonus;
    const nextLevelNum = Math.min(50, result.levelId + 1);

    const updatedCompleted = {
      ...playerData.completedLevels,
      [result.levelId]: {
        stars: Math.max(result.stars, playerData.completedLevels[result.levelId]?.stars || 0),
        highCoins: Math.max(totalCoinsEarned, playerData.completedLevels[result.levelId]?.highCoins || 0),
        completedAt: new Date().toISOString(),
      },
    };

    const newHighest = Math.max(playerData.highestUnlockedLevel, nextLevelNum);
    const newTotalStars = Object.values(updatedCompleted).reduce<number>((acc, curr: any) => acc + (curr?.stars || 0), 0);

    // Update Stats
    const updatedStats = {
      ...playerData.stats,
      totalCoinsEarned: (playerData.stats.totalCoinsEarned || 0) + totalCoinsEarned,
      totalLevelsCompleted: Object.keys(updatedCompleted).length,
    };

    // Update Achievements
    const updatedAchievements = { ...playerData.achievements };

    // Level 1 milestone
    if (updatedAchievements['ach_first_step']) {
      updatedAchievements['ach_first_step'].progress = 1;
      updatedAchievements['ach_first_step'].unlocked = true;
    } else {
      updatedAchievements['ach_first_step'] = { progress: 1, unlocked: true, claimed: false };
    }

    // Level 10 milestone
    if (newHighest >= 10) {
      if (updatedAchievements['ach_world_1']) {
        updatedAchievements['ach_world_1'].progress = 10;
        updatedAchievements['ach_world_1'].unlocked = true;
      } else {
        updatedAchievements['ach_world_1'] = { progress: 10, unlocked: true, claimed: false };
      }
    }

    // Star Collector achievement
    if (updatedAchievements['ach_stars']) {
      updatedAchievements['ach_stars'].progress = newTotalStars;
      if (newTotalStars >= 15) updatedAchievements['ach_stars'].unlocked = true;
    } else {
      updatedAchievements['ach_stars'] = {
        progress: newTotalStars,
        unlocked: newTotalStars >= 15,
        claimed: false,
      };
    }

    // Coins hoarder achievement
    const newTotalCoins = playerData.coins + totalCoinsEarned;
    if (updatedAchievements['ach_coins_500']) {
      updatedAchievements['ach_coins_500'].progress = newTotalCoins;
      if (newTotalCoins >= 500) updatedAchievements['ach_coins_500'].unlocked = true;
    } else {
      updatedAchievements['ach_coins_500'] = {
        progress: newTotalCoins,
        unlocked: newTotalCoins >= 500,
        claimed: false,
      };
    }

    const updatedData: PlayerData = {
      ...playerData,
      coins: newTotalCoins,
      xp: playerData.xp + result.xp,
      highestUnlockedLevel: newHighest,
      completedLevels: updatedCompleted,
      stats: updatedStats,
      achievements: updatedAchievements,
    };

    handleUpdatePlayerData(updatedData);
    setCompletedLevelData(result);
  };

  // Reset progress handler
  const handleResetProgress = () => {
    const freshData = resetPlayerData();
    setPlayerData(freshData);
    setCurrentView('menu');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Persistent App Header (Hidden during active gameplay for maximum screen real-estate) */}
      {currentView !== 'gameplay' && (
        <Header
          playerData={playerData}
          language={playerData.settings.language}
          onOpenSettings={() => setCurrentView('settings')}
          onOpenTutorial={() => setShowTutorial(true)}
          onOpenDailyReward={() => setShowDailyReward(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onSelectCharacterTab={() => setCurrentView('character')}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col justify-start">
        {currentView === 'menu' && (
          <MainMenu
            playerData={playerData}
            language={playerData.settings.language}
            onNavigate={(tab) => {
              if (tab === 'play') handleQuickPlay();
              else if (tab === 'achievements') setShowAchievements(true);
              else setCurrentView(tab);
            }}
            onQuickPlay={handleQuickPlay}
          />
        )}

        {currentView === 'levels' && (
          <LevelMap
            playerData={playerData}
            language={playerData.settings.language}
            onSelectLevel={handleStartLevel}
            onBackToMenu={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'gameplay' && activeLevel && (
          <GameCanvas
            level={activeLevel}
            playerData={playerData}
            language={playerData.settings.language}
            onCompleteLevel={handleLevelCompleted}
            onExitToMenu={() => {
              setActiveLevel(null);
              setCurrentView('menu');
            }}
            onOpenSettings={() => {
              setActiveLevel(null);
              setCurrentView('settings');
            }}
          />
        )}

        {currentView === 'shop' && (
          <Shop
            playerData={playerData}
            language={playerData.settings.language}
            onUpdatePlayerData={handleUpdatePlayerData}
            onBackToMenu={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'character' && (
          <CharacterSelect
            playerData={playerData}
            language={playerData.settings.language}
            onUpdatePlayerData={handleUpdatePlayerData}
            onBackToMenu={() => setCurrentView('menu')}
            onNavigateToShop={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'inventory' && (
          <Inventory
            playerData={playerData}
            language={playerData.settings.language}
            onUpdatePlayerData={handleUpdatePlayerData}
            onBackToMenu={() => setCurrentView('menu')}
            onNavigateToShop={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            playerData={playerData}
            language={playerData.settings.language}
            onUpdatePlayerData={handleUpdatePlayerData}
            onResetProgress={handleResetProgress}
            onBackToMenu={() => setCurrentView('menu')}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Daily Reward */}
      {showDailyReward && (
        <DailyRewardModal
          playerData={playerData}
          language={playerData.settings.language}
          onUpdatePlayerData={handleUpdatePlayerData}
          onClose={() => setShowDailyReward(false)}
        />
      )}

      {/* 2. Achievements */}
      {showAchievements && (
        <AchievementsModal
          playerData={playerData}
          language={playerData.settings.language}
          onUpdatePlayerData={handleUpdatePlayerData}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* 3. How to Play Tutorial */}
      {showTutorial && (
        <TutorialModal
          language={playerData.settings.language}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* 4. Level Complete Victory */}
      {completedLevelData && (
        <LevelCompleteModal
          levelId={completedLevelData.levelId}
          coins={completedLevelData.coins}
          bonus={completedLevelData.bonus}
          xp={completedLevelData.xp}
          stars={completedLevelData.stars}
          language={playerData.settings.language}
          hasNextLevel={completedLevelData.levelId < 50}
          onNextLevel={() => {
            const nextLvl = LEVELS.find((l) => l.id === completedLevelData.levelId + 1);
            setCompletedLevelData(null);
            if (nextLvl) {
              handleStartLevel(nextLvl);
            } else {
              setCurrentView('levels');
            }
          }}
          onReplayLevel={() => {
            const replayLvl = LEVELS.find((l) => l.id === completedLevelData.levelId);
            setCompletedLevelData(null);
            if (replayLvl) {
              handleStartLevel(replayLvl);
            }
          }}
          onLevelsMap={() => {
            setCompletedLevelData(null);
            setCurrentView('levels');
          }}
          onHome={() => {
            setCompletedLevelData(null);
            setCurrentView('menu');
          }}
        />
      )}
    </div>
  );
}
