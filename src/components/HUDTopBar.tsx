import React from 'react';
import { Volume2, VolumeX, Moon, Sliders, BarChart2, Flame, Smartphone, Zap } from 'lucide-react';
import { ThemeMode } from '../types';
import { THEMES } from '../utils/theme';

interface HUDTopBarProps {
  theme: ThemeMode;
  streak: number;
  todayCount: number;
  soundVolume: number;
  isMuted: boolean;
  volumeKeysEnabled: boolean;
  isFreeHandActive?: boolean;
  onToggleFreeHand?: () => void;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onToggleStealth: () => void;
}

export const HUDTopBar: React.FC<HUDTopBarProps> = ({
  theme,
  streak,
  todayCount,
  isMuted,
  volumeKeysEnabled,
  isFreeHandActive = false,
  onToggleFreeHand,
  onToggleMute,
  onOpenSettings,
  onOpenStats,
  onToggleStealth
}) => {
  const currentTheme = THEMES[theme] || THEMES['cyber-emerald'];

  return (
    <header className="fixed top-3 inset-x-0 mx-auto max-w-lg px-3 z-30 pointer-events-none">
      <div className="cyber-glass rounded-2xl px-3.5 py-2 flex items-center justify-between pointer-events-auto shadow-2xl transition-all">
        {/* Left: Streak & Today Count */}
        <button
          onClick={onOpenStats}
          className="flex items-center gap-2 group text-left cursor-pointer transition-opacity active:opacity-75 focus-visible:outline-none"
          title="View streaks and statistics"
        >
          <div 
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-transform group-hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(255, 120, 0, 0.15)',
              border: '1px solid rgba(255, 120, 0, 0.35)'
            }}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono-tabular font-bold tracking-tight text-white flex items-center gap-1">
              <span>{streak}d</span>
              <span className="text-slate-400 font-normal">streak</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono-tabular">
              {todayCount.toLocaleString()} today
            </span>
          </div>
        </button>

        {/* Center: Hardware Volume Key Status Pill */}
        <div 
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-tabular tracking-wider"
          style={{
            backgroundColor: volumeKeysEnabled ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${volumeKeysEnabled ? currentTheme.badgeBorder : 'rgba(255, 255, 255, 0.08)'}`,
            color: volumeKeysEnabled ? currentTheme.primaryNeon : '#94A3B8'
          }}
          title={volumeKeysEnabled ? 'Hardware Volume Keys Active: Press Vol Up/Down to count' : 'Volume Keys Disabled'}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="font-medium">{volumeKeysEnabled ? 'VOL KEYS ON' : 'VOL KEYS OFF'}</span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1">
          {/* Free Hand Mode Quick Button */}
          {onToggleFreeHand && (
            <button
              onClick={onToggleFreeHand}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                isFreeHandActive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-lg animate-pulse'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={isFreeHandActive ? 'Stop Free Hand Mode' : 'Start Free Hand Mode (Auto beads with heavy vibration)'}
              aria-label="Toggle Free Hand Mode"
            >
              <Zap className="w-4 h-4" style={{ color: isFreeHandActive ? '#EF4444' : currentTheme.primaryNeon }} />
            </button>
          )}

          {/* Stealth / Pocket Mode */}
          <button
            onClick={onToggleStealth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Pocket / Stealth Mode (Low-light zero-look counting)"
            aria-label="Toggle Stealth Mode"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Audio Feedback"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Statistics & Spiritual Milestones"
            aria-label="Open Statistics"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Settings / Bead Studio */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Bead Studio & Customization"
            aria-label="Open Bead Studio Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
