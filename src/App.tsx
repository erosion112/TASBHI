import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TasbihSettings, 
  UserStats, 
  ZikrItem 
} from './types';
import { DEFAULT_ADHKAR } from './data/adhkar';
import { 
  loadSettings, 
  saveSettings, 
  loadUserStats, 
  recordDhikrIncrement, 
  loadCustomAdhkar, 
  saveCustomAdhkar,
  loadSessionState,
  saveSessionState,
  getTodayDateString 
} from './utils/storage';
import { playTickSound, playTargetCompletedChord, triggerHaptic, playSubThud } from './utils/audio';
import { THEMES } from './utils/theme';
import { useHardwareKeys } from './hooks/useHardwareKeys';
import { useVoiceCounting } from './hooks/useVoiceCounting';

import { CyberBeadsCanvas } from './components/CyberBeadsCanvas';
import { HUDTopBar } from './components/HUDTopBar';
import { ZikrCenterDisplay } from './components/ZikrCenterDisplay';
import { HUDBottomBar } from './components/HUDBottomBar';
import { ZikrSelectorModal } from './components/ZikrSelectorModal';
import { BeadStudioModal } from './components/BeadStudioModal';
import { StatsModal } from './components/StatsModal';
import { StealthOverlay } from './components/StealthOverlay';

export default function App() {
  // 1. Initial State Hydration
  const [settings, setSettings] = useState<TasbihSettings>(loadSettings);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [customAdhkar, setCustomAdhkar] = useState<ZikrItem[]>(loadCustomAdhkar);

  const initialSession = useMemo(() => loadSessionState(), []);
  const [count, setCount] = useState<number>(initialSession.currentCount);
  const [cycle, setCycle] = useState<number>(initialSession.currentCycle);
  const [currentTarget, setCurrentTarget] = useState<number>(initialSession.currentTarget);

  // Free Hand Mode (Auto Move & Heavy Vibration)
  const [isFreeHandActive, setIsFreeHandActive] = useState(false);
  const [freeHandSpeedMs, setFreeHandSpeedMs] = useState(settings.freeHandSpeedMs || 1200);

  // Combine default & custom adhkar
  const allAdhkar = useMemo(() => [...DEFAULT_ADHKAR, ...customAdhkar], [customAdhkar]);

  const [selectedZikrId, setSelectedZikrId] = useState<string>(initialSession.selectedZikrId);
  const selectedZikr = useMemo(() => {
    return allAdhkar.find(a => a.id === selectedZikrId) || DEFAULT_ADHKAR[0];
  }, [allAdhkar, selectedZikrId]);

  // Modal Visibility States
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isStealthOpen, setIsStealthOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync settings updates
  const updateSettings = useCallback((partial: Partial<TasbihSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...partial };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // Save session state on count changes
  useEffect(() => {
    saveSessionState({
      currentCount: count,
      currentCycle: cycle,
      selectedZikrId: selectedZikr.id,
      currentTarget
    });
  }, [count, cycle, selectedZikr.id, currentTarget]);

  // 2. Core Dhikr Increment Logic
  const handleIncrement = useCallback((options?: { isFreeHand?: boolean }) => {
    // Audio feedback
    const activeVolume = isMuted ? 0 : settings.soundVolume;
    playTickSound(settings.soundPack, activeVolume);

    if (options?.isFreeHand) {
      playSubThud(activeVolume);
    }

    // Haptic feedback with heavy vibration support for Free Hand Mode
    if (settings.hapticEnabled) {
      if (options?.isFreeHand && settings.heavyVibration) {
        triggerHaptic('heavy');
      } else {
        triggerHaptic('snap');
      }
    }

    // Update count & check target completion
    setCount(prevCount => {
      const nextCount = prevCount + 1;

      // Check if target reached (and target is not 0 for infinite)
      if (currentTarget > 0 && nextCount >= currentTarget) {
        // Play celebratory chime
        playTargetCompletedChord(activeVolume);
        if (settings.hapticEnabled) {
          triggerHaptic('complete');
        }

        // Automatic Fatimah Sequence Progression:
        if (selectedZikr.id === 'subhanallah' && currentTarget === 33) {
          setSelectedZikrId('alhamdulillah');
          setCurrentTarget(33);
        } else if (selectedZikr.id === 'alhamdulillah' && currentTarget === 33) {
          setSelectedZikrId('allahu-akbar');
          setCurrentTarget(34);
        }

        // Increment cycle
        setCycle(c => c + 1);
        return 0; // reset for next lap
      }

      return nextCount;
    });

    // Record stats
    setStats(prevStats => recordDhikrIncrement(selectedZikr.id, prevStats));
  }, [
    isMuted, 
    settings.soundVolume, 
    settings.soundPack, 
    settings.hapticEnabled, 
    settings.heavyVibration,
    currentTarget, 
    selectedZikr.id
  ]);

  // 2.5 Free Hand Mode Automated Loop
  useEffect(() => {
    if (!isFreeHandActive) return;

    const interval = setInterval(() => {
      handleIncrement({ isFreeHand: true });
    }, freeHandSpeedMs);

    return () => clearInterval(interval);
  }, [isFreeHandActive, freeHandSpeedMs, handleIncrement]);

  const handleToggleFreeHand = useCallback(() => {
    setIsFreeHandActive(prev => {
      const next = !prev;
      if (next && settings.hapticEnabled) {
        triggerHaptic('heavy');
        playSubThud(settings.soundVolume);
      }
      return next;
    });
  }, [settings.hapticEnabled, settings.soundVolume]);

  const handleChangeFreeHandSpeed = useCallback((speedMs: number) => {
    setFreeHandSpeedMs(speedMs);
    updateSettings({ freeHandSpeedMs: speedMs });
  }, [updateSettings]);

  // 3. Reset Handler
  const handleReset = useCallback(() => {
    setCount(0);
    setCycle(1);
    if (settings.hapticEnabled) {
      triggerHaptic('tap');
    }
  }, [settings.hapticEnabled]);

  // 4. Target Set Handler
  const handleSetTarget = useCallback((newTarget: number) => {
    setCurrentTarget(newTarget);
    setCount(0);
    if (settings.hapticEnabled) {
      triggerHaptic('tap');
    }
  }, [settings.hapticEnabled]);

  // 5. Select Dhikr Handler
  const handleSelectZikr = useCallback((item: ZikrItem) => {
    setSelectedZikrId(item.id);
    setCurrentTarget(item.defaultTarget);
    setCount(0);
    setCycle(1);
  }, []);

  // 6. Custom Dhikr Management
  const handleAddCustomZikr = useCallback((newItem: ZikrItem) => {
    setCustomAdhkar(prev => {
      const updated = [newItem, ...prev];
      saveCustomAdhkar(updated);
      return updated;
    });
  }, []);

  const handleDeleteCustomZikr = useCallback((id: string) => {
    setCustomAdhkar(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveCustomAdhkar(updated);
      return updated;
    });
    if (selectedZikrId === id) {
      setSelectedZikrId(DEFAULT_ADHKAR[0].id);
      setCurrentTarget(DEFAULT_ADHKAR[0].defaultTarget);
      setCount(0);
    }
  }, [selectedZikrId]);

  // 7. Hardware Volume Key Integration
  useHardwareKeys({
    enabled: settings.volumeKeysEnabled,
    onIncrement: handleIncrement
  });

  // 8. Hands-Free Voice Counting Integration
  const { isListening, audioLevel, lastHeardWord } = useVoiceCounting({
    enabled: settings.vocalCountingEnabled,
    onIncrement: handleIncrement
  });

  const toggleVoiceCounting = useCallback(() => {
    updateSettings({ vocalCountingEnabled: !settings.vocalCountingEnabled });
  }, [settings.vocalCountingEnabled, updateSettings]);

  // Current theme tokens
  const currentTheme = THEMES[settings.theme] || THEMES['cyber-emerald'];
  const todayKey = getTodayDateString();
  const todayCount = stats.dailyHistory[todayKey] || 0;

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden select-none bg-[#05080E] flex flex-col justify-between"
      style={{
        background: currentTheme.bgCanvasGradient
      }}
    >
      {/* Background Interactive Beads Canvas with Vertical Drag-to-Pull Physics */}
      <div className="absolute inset-0 z-0">
        <CyberBeadsCanvas
          theme={settings.theme}
          beadStyle={settings.beadStyle}
          dragSensitivity={settings.dragSensitivity}
          currentCount={count}
          strandPosition={settings.strandPosition}
          onIncrement={handleIncrement}
        />
      </div>

      {/* Floating HUD Top Bar */}
      <HUDTopBar
        theme={settings.theme}
        streak={stats.currentStreak}
        todayCount={todayCount}
        soundVolume={settings.soundVolume}
        isMuted={isMuted}
        volumeKeysEnabled={settings.volumeKeysEnabled}
        isFreeHandActive={isFreeHandActive}
        onToggleFreeHand={handleToggleFreeHand}
        onToggleMute={() => setIsMuted(prev => !prev)}
        onOpenSettings={() => setIsStudioOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onToggleStealth={() => setIsStealthOpen(true)}
      />

      {/* Main Content: Beads on Left, Digital Count on Right */}
      <main className="relative z-10 pt-16 sm:pt-20 pb-20 flex-1 flex flex-col justify-center pointer-events-none">
        <ZikrCenterDisplay
          zikr={selectedZikr}
          count={count}
          cycle={cycle}
          target={currentTarget}
          theme={settings.theme}
          strandPosition={settings.strandPosition}
          isFreeHandActive={isFreeHandActive}
          freeHandSpeedMs={freeHandSpeedMs}
          onReset={handleReset}
          onSetTarget={handleSetTarget}
          onOpenSelector={() => setIsSelectorOpen(true)}
          onIncrement={() => handleIncrement()}
          onToggleFreeHand={handleToggleFreeHand}
          onChangeFreeHandSpeed={handleChangeFreeHandSpeed}
        />
      </main>

      {/* Tactile Left Bead Lane Guide */}
      <div 
        className="absolute z-10 pointer-events-none flex flex-col items-center transition-all duration-300"
        style={{
          left: (settings.strandPosition || 'left') === 'left' 
            ? '20%' 
            : settings.strandPosition === 'right' 
            ? '78%' 
            : '50%',
          bottom: '78px'
        }}
      >
        <div className="text-[10px] font-mono-tabular tracking-wider text-slate-400/80 uppercase flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
          <span>↓ Pull Bead</span>
          {settings.volumeKeysEnabled && (
            <>
              <span className="text-slate-600">·</span>
              <span style={{ color: currentTheme.primaryNeon }}>Vol Keys</span>
            </>
          )}
        </div>
      </div>

      {/* Floating HUD Bottom Bar */}
      <HUDBottomBar
        theme={settings.theme}
        currentZikr={selectedZikr}
        voiceListening={isListening}
        audioLevel={audioLevel}
        lastHeardWord={lastHeardWord}
        onToggleVoice={toggleVoiceCounting}
        onOpenZikrSelector={() => setIsSelectorOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
      />

      {/* Modals & Overlays */}
      <ZikrSelectorModal
        isOpen={isSelectorOpen}
        theme={settings.theme}
        currentZikrId={selectedZikr.id}
        adhkarList={allAdhkar}
        onSelectZikr={handleSelectZikr}
        onAddCustomZikr={handleAddCustomZikr}
        onDeleteCustomZikr={handleDeleteCustomZikr}
        onClose={() => setIsSelectorOpen(false)}
      />

      <BeadStudioModal
        isOpen={isStudioOpen}
        settings={settings}
        onUpdateSettings={updateSettings}
        onClose={() => setIsStudioOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        theme={settings.theme}
        stats={stats}
        adhkarList={allAdhkar}
        onClose={() => setIsStatsOpen(false)}
      />

      <StealthOverlay
        isOpen={isStealthOpen}
        count={count}
        isFreeHandActive={isFreeHandActive}
        onIncrement={() => handleIncrement()}
        onToggleFreeHand={handleToggleFreeHand}
        onExit={() => setIsStealthOpen(false)}
      />
    </div>
  );
}
