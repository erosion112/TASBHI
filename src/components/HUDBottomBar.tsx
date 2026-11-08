import React from 'react';
import { Mic, MicOff, BookOpen, Palette, ChevronUp } from 'lucide-react';
import { ThemeMode, ZikrItem } from '../types';
import { THEMES } from '../utils/theme';

interface HUDBottomBarProps {
  theme: ThemeMode;
  currentZikr: ZikrItem;
  voiceListening: boolean;
  audioLevel: number;
  lastHeardWord: string | null;
  onToggleVoice: () => void;
  onOpenZikrSelector: () => void;
  onOpenStudio: () => void;
}

export const HUDBottomBar: React.FC<HUDBottomBarProps> = ({
  theme,
  currentZikr,
  voiceListening,
  audioLevel,
  lastHeardWord,
  onToggleVoice,
  onOpenZikrSelector,
  onOpenStudio
}) => {
  const currentTheme = THEMES[theme] || THEMES['cyber-emerald'];

  return (
    <footer className="fixed bottom-3 inset-x-0 mx-auto max-w-lg px-3 z-30 pointer-events-none">
      <div className="cyber-glass rounded-2xl p-2 flex items-center justify-between gap-2 pointer-events-auto shadow-2xl">
        {/* Left: Quick Dhikr Drawer Trigger */}
        <button
          onClick={onOpenZikrSelector}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-left flex-1 min-w-0 cursor-pointer focus-visible:outline-none"
          title="Select Dhikr or View Duas"
        >
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ 
              backgroundColor: 'rgba(0, 242, 254, 0.12)',
              border: `1px solid ${currentTheme.badgeBorder}`
            }}
          >
            <BookOpen className="w-3.5 h-3.5" style={{ color: currentTheme.primaryNeon }} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate flex items-center gap-1">
              {currentZikr.transliteration}
              <ChevronUp className="w-3 h-3 text-slate-400 shrink-0" />
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {currentZikr.translation}
            </span>
          </div>
        </button>

        {/* Center: Hands-Free Voice Listener Pill */}
        <button
          onClick={onToggleVoice}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 focus-visible:outline-none"
          style={{
            backgroundColor: voiceListening ? 'rgba(0, 255, 135, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${voiceListening ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: voiceListening ? `0 0 16px ${currentTheme.beadGlow}` : 'none'
          }}
          title={voiceListening ? 'Voice Listener Active: Speak Dhikr to count' : 'Enable Voice Counting'}
        >
          {voiceListening ? (
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" style={{ color: currentTheme.primaryNeon }} />
              {/* Animated audio frequency spectrum bars */}
              <div className="flex items-end gap-0.5 h-3.5">
                {[0.4, 0.9, 0.6, 1.0, 0.5].map((factor, idx) => {
                  const h = Math.max(3, Math.min(14, (audioLevel * 14 * factor) + (Math.sin(Date.now() / 200 + idx) * 2 + 3)));
                  return (
                    <div
                      key={idx}
                      className="w-1 rounded-full transition-all duration-75"
                      style={{
                        height: `${h}px`,
                        backgroundColor: currentTheme.primaryNeon
                      }}
                    />
                  );
                })}
              </div>
              <span 
                className="text-[10px] font-mono-tabular font-bold tracking-tight hidden sm:inline"
                style={{ color: currentTheme.primaryNeon }}
              >
                {lastHeardWord ? lastHeardWord : 'LISTENING'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-300 hover:text-white">
              <MicOff className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium hidden sm:inline text-slate-300">
                Voice Off
              </span>
            </div>
          )}
        </button>

        {/* Right: Bead Studio & Themes */}
        <button
          onClick={onOpenStudio}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white shrink-0 cursor-pointer"
          title="Open Bead Studio / Themes"
          aria-label="Open Bead Studio"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
