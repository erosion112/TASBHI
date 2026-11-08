import React, { useState } from 'react';
import { RotateCcw, ChevronRight, Hand, Zap, Play, Pause, Vibrate } from 'lucide-react';
import { ZikrItem, ThemeMode, StrandPosition } from '../types';
import { THEMES } from '../utils/theme';

interface ZikrCenterDisplayProps {
  zikr: ZikrItem;
  count: number;
  cycle: number;
  target: number; // 0 for infinite/free
  theme: ThemeMode;
  strandPosition?: StrandPosition;
  isFreeHandActive?: boolean;
  freeHandSpeedMs?: number;
  onReset: () => void;
  onSetTarget: (newTarget: number) => void;
  onOpenSelector: () => void;
  onIncrement?: () => void;
  onToggleFreeHand?: () => void;
  onChangeFreeHandSpeed?: (speedMs: number) => void;
}

export const ZikrCenterDisplay: React.FC<ZikrCenterDisplayProps> = ({
  zikr,
  count,
  cycle,
  target,
  theme,
  strandPosition = 'left',
  isFreeHandActive = false,
  freeHandSpeedMs = 1200,
  onReset,
  onSetTarget,
  onOpenSelector,
  onIncrement,
  onToggleFreeHand,
  onChangeFreeHandSpeed
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const currentTheme = THEMES[theme] || THEMES['cyber-emerald'];

  const isInfinite = target === 0;
  const progressRatio = isInfinite ? 0 : Math.min(1, count / target);
  const percentage = isInfinite ? 100 : Math.round(progressRatio * 100);

  const targetPresets = [33, 99, 100, 0];

  const handleResetClick = () => {
    if (count === 0 && cycle === 1) return;
    if (count > 0 && !showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3500);
      return;
    }
    onReset();
    setShowResetConfirm(false);
  };

  // Alignment classes for the digital count & telemetry controls
  // When beads are on the left -> count is aligned to the right
  const counterAlignment = strandPosition === 'left'
    ? 'ml-auto mr-2 sm:mr-8 md:mr-16 w-[70%] sm:w-[58%] md:w-[50%] max-w-lg items-center'
    : strandPosition === 'right'
    ? 'mr-auto ml-2 sm:ml-8 md:ml-16 w-[70%] sm:w-[58%] md:w-[50%] max-w-lg items-center'
    : 'mx-auto max-w-md w-full items-center';

  return (
    <div className="w-full flex flex-col pointer-events-none select-none">
      {/* 1. Current Supplication Box - Centered Horizontally at Top */}
      <div className="w-full max-w-md md:max-w-lg mx-auto px-4 mb-2 sm:mb-4 flex justify-center pointer-events-auto">
        <button
          onClick={onOpenSelector}
          className="group flex flex-col items-center gap-1 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl cyber-glass hover:bg-white/[0.08] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none w-full shadow-2xl"
          title="Tap to change supplication / view meaning"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono-tabular">
              Current Supplication
            </span>
            <div className="flex items-center gap-0.5 text-[10px] text-slate-400 group-hover:text-white transition-colors">
              <span>Change</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          <span 
            className="font-arabic text-3xl sm:text-4xl md:text-5xl text-white font-bold tracking-wide transition-transform group-hover:scale-[1.02] my-0.5"
            style={{
              textShadow: `0 0 16px ${currentTheme.beadGlow}, 0 0 28px ${currentTheme.primaryNeon}`
            }}
            dir="rtl"
          >
            {zikr.arabic}
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-100 group-hover:text-white transition-colors">
              {zikr.transliteration}
            </span>
            <span className="text-[11px] text-slate-400 font-normal line-clamp-1">
              · {zikr.translation}
            </span>
          </div>
        </button>
      </div>

      {/* 2. Digital Readout & Controls on Right Side (Beads on Left) */}
      <div className={`flex flex-col justify-center text-center px-2 sm:px-4 transition-all duration-300 ${counterAlignment}`}>
        {/* Massive Digital Readout with Cybernetic Outer Glow */}
        <div className="relative my-2 sm:my-4 flex flex-col items-center justify-center w-full">
        {/* Glow backdrop behind number */}
        <div 
          className="absolute inset-0 m-auto w-40 h-28 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: currentTheme.primaryNeon }}
        />

        <div className="relative flex items-baseline justify-center gap-1.5">
          <span
            className="font-mono-tabular font-extrabold text-7xl sm:text-8xl md:text-9xl tracking-tight select-none transition-all duration-100"
            style={{
              color: '#FFFFFF',
              textShadow: `0 0 20px ${currentTheme.primaryNeon}, 0 0 45px ${currentTheme.primaryNeon}`
            }}
          >
            {count}
          </span>
          
          {!isInfinite && (
            <span className="font-mono-tabular text-xl sm:text-2xl text-slate-400 font-medium">
              /{target}
            </span>
          )}
        </div>

        {/* Telemetry Cycle Badge & Progress */}
        <div className="flex items-center gap-2 mt-1">
          <div 
            className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tabular font-bold tracking-wide"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${currentTheme.badgeBorder}`,
              color: currentTheme.primaryNeon
            }}
          >
            Cycle {cycle}
          </div>

          {!isInfinite && (
            <div className="text-[11px] font-mono-tabular text-slate-300 font-medium">
              {percentage}% Complete
            </div>
          )}
        </div>

        {/* Progress Bar HUD */}
        {!isInfinite && (
          <div className="w-full max-w-[240px] sm:max-w-[280px] h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/10 mt-2.5">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${currentTheme.primaryNeon}, ${currentTheme.secondaryNeon})`,
                boxShadow: `0 0 10px ${currentTheme.primaryNeon}`
              }}
            />
          </div>
        )}
      </div>

      {/* 3. Target Preset Buttons & Reset Control */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto">
        {targetPresets.map(preset => {
          const isSelected = target === preset;
          return (
            <button
              key={preset}
              onClick={() => onSetTarget(preset)}
              className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono-tabular font-medium transition-all cursor-pointer active:scale-95"
              style={{
                backgroundColor: isSelected ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#000000' : '#94A3B8',
                border: `1px solid ${isSelected ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: isSelected ? `0 0 12px ${currentTheme.primaryNeon}` : 'none'
              }}
              title={preset === 0 ? 'Infinite / Free Dhikr' : `Set target to ${preset}`}
            >
              {preset === 0 ? '∞ Free' : preset}
            </button>
          );
        })}

        {/* Reset Counter Button */}
        <button
          onClick={handleResetClick}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono-tabular font-medium transition-all cursor-pointer active:scale-95 ${
            showResetConfirm
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-lg shadow-rose-950'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
          }`}
          title="Reset counter"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{showResetConfirm ? 'Confirm?' : 'Reset'}</span>
        </button>
      </div>

      {/* 4. Action Controls: Tap Counter & Free Hand Mode */}
      <div className="mt-3.5 pointer-events-auto w-full max-w-[270px] sm:max-w-[300px] flex flex-col gap-2">
        {onIncrement && (
          <button
            onClick={onIncrement}
            className="w-full py-2.5 px-4 rounded-2xl cyber-glass hover:bg-white/[0.1] active:scale-[0.96] transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-xl"
            style={{
              border: `1px solid ${currentTheme.badgeBorder}`
            }}
          >
            <Hand className="w-4 h-4 transition-transform group-active:scale-110" style={{ color: currentTheme.primaryNeon }} />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Tap or Pull Bead
            </span>
          </button>
        )}

        {/* Free Hand Mode Card */}
        {onToggleFreeHand && (
          <div 
            className="w-full rounded-2xl p-2.5 cyber-glass transition-all shadow-xl"
            style={{
              border: isFreeHandActive ? `1px solid ${currentTheme.primaryNeon}` : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: isFreeHandActive ? `0 0 18px ${currentTheme.beadGlow}` : 'none'
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-left min-w-0">
                <div 
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isFreeHandActive ? 'bg-cyan-400 text-black shadow-md' : 'bg-white/5 text-slate-400'
                  }`}
                  style={{
                    backgroundColor: isFreeHandActive ? currentTheme.primaryNeon : undefined,
                    color: isFreeHandActive ? '#000000' : undefined
                  }}
                >
                  <Zap className={`w-3.5 h-3.5 ${isFreeHandActive ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                    <span>Free Hand Mode</span>
                    {isFreeHandActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <Vibrate className="w-2.5 h-2.5 text-cyan-300" />
                    <span>Heavy vibration</span>
                  </span>
                </div>
              </div>

              <button
                onClick={onToggleFreeHand}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
                style={{
                  backgroundColor: isFreeHandActive ? '#EF4444' : currentTheme.primaryNeon,
                  color: isFreeHandActive ? '#FFFFFF' : '#000000',
                  boxShadow: isFreeHandActive ? '0 0 12px rgba(239, 68, 68, 0.4)' : `0 0 12px ${currentTheme.primaryNeon}`
                }}
              >
                {isFreeHandActive ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Auto</span>
                  </>
                )}
              </button>
            </div>

            {/* Speed Cadence Selector */}
            <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-white/5">
              <span className="text-[10px] text-slate-400 font-mono-tabular">Speed:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: '0.8s', ms: 800 },
                  { label: '1.2s', ms: 1200 },
                  { label: '1.8s', ms: 1800 }
                ].map(speed => {
                  const isSelected = freeHandSpeedMs === speed.ms;
                  return (
                    <button
                      key={speed.ms}
                      onClick={() => onChangeFreeHandSpeed && onChangeFreeHandSpeed(speed.ms)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono-tabular font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#000000' : '#94A3B8'
                      }}
                    >
                      {speed.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
