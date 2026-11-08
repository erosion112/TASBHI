import React from 'react';
import { X, Palette, Volume2, Smartphone, Vibrate, Sparkles, Sliders } from 'lucide-react';
import { TasbihSettings, ThemeMode, BeadStyle, SoundPack } from '../types';
import { THEMES } from '../utils/theme';
import { playTickSound, triggerHaptic } from '../utils/audio';

interface BeadStudioModalProps {
  isOpen: boolean;
  settings: TasbihSettings;
  onUpdateSettings: (newSettings: Partial<TasbihSettings>) => void;
  onClose: () => void;
}

export const BeadStudioModal: React.FC<BeadStudioModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES['cyber-emerald'];

  const themesList: { id: ThemeMode; name: string; color: string; desc: string }[] = [
    { id: 'cyber-emerald', name: 'Cyber Emerald', color: '#00FF87', desc: 'Radiant electric green & cyber pulse' },
    { id: 'cyber-cyan', name: 'Neon Cyan', color: '#00F2FE', desc: 'Holographic deep-space blue glow' },
    { id: 'cyber-amber', name: 'Solar Amber', color: '#FFD700', desc: 'Warm celestial gold & electric amber' },
    { id: 'cyber-violet', name: 'Ethereal Violet', color: '#BD00FF', desc: 'Mystical neon amethyst & magenta' },
    { id: 'obsidian-matrix', name: 'Obsidian Stealth', color: '#38BDF8', desc: 'Ultra-dark matrix with subtle cyan accents' }
  ];

  const beadStyles: { id: BeadStyle; name: string; desc: string }[] = [
    { id: 'cyber-orb', name: 'Cyber Orb', desc: '3D glossy sphere with inner radiant core and specular gleam' },
    { id: 'luminescent-crystal', name: 'Luminescent Crystal', desc: 'Faceted refractive geometric gem with sharp bevels' },
    { id: 'metallic-core', name: 'Metallic Core', desc: 'Brushed titanium sphere with glowing neon seam' },
    { id: 'neon-ring', name: 'Holo Ring', desc: 'Dual concentric glowing energetic toroid' }
  ];

  const soundPacks: { id: SoundPack; name: string; desc: string }[] = [
    { id: 'mechanical-snap', name: 'Mechanical Snap', desc: 'Crisp digital tactile click with acoustic snap' },
    { id: 'wooden-misbaha', name: 'Wooden Misbaha', desc: 'Warm, organic wooden beads knocking together' },
    { id: 'crystal-chime', name: 'Crystal Chime', desc: 'Ethereal harmonic glass bell chime' },
    { id: 'soft-pulse', name: 'Soft Pulse', desc: 'Low-frequency futuristic subtle impulse' },
    { id: 'silent', name: 'Silent / Mute', desc: 'Completely noiseless counting' }
  ];

  const handleTestSound = (pack: SoundPack) => {
    playTickSound(pack, settings.soundVolume);
    if (settings.hapticEnabled) {
      triggerHaptic('snap');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
      <div 
        className="w-full max-w-lg max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#070D14] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        style={{
          boxShadow: `0 0 35px ${currentTheme.beadGlow}`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: currentTheme.primaryNeon }} />
            <h2 className="text-base font-bold text-white tracking-tight">
              Bead Studio & Control Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. Hardware Volume Key Counting (Core requirement from Implementation Plan) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 242, 254, 0.15)' }}
                >
                  <Smartphone className="w-4 h-4" style={{ color: currentTheme.primaryNeon }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Hardware Volume Key Counting</h3>
                  <p className="text-[11px] text-slate-400">
                    Press Volume Up / Down or Space/Arrow keys to count hands-free
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onUpdateSettings({ volumeKeysEnabled: !settings.volumeKeysEnabled })}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  settings.volumeKeysEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.volumeKeysEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {settings.volumeKeysEnabled && (
              <div className="text-[10px] text-cyan-300/80 font-mono-tabular bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                ✓ Active: Works in pocket mode or while riding/walking without looking at the screen.
              </div>
            )}
          </div>

          {/* 1.5. Bead Strand & Counter Layout Alignment */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">Bead & Counter Layout</h3>
                <p className="text-[11px] text-slate-400">
                  Separates tactile beads from digital readouts for clear visibility
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: 'left', label: 'Beads Left', desc: 'Count on Right (Clear)' },
                { id: 'center', label: 'Centered', desc: 'Overlaid' },
                { id: 'right', label: 'Beads Right', desc: 'Count on Left' }
              ].map(pos => {
                const isSelected = (settings.strandPosition || 'left') === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onUpdateSettings({ strandPosition: pos.id as any })}
                    className="p-2 rounded-xl text-center border transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#000000' : '#94A3B8',
                      borderColor: isSelected ? currentTheme.primaryNeon : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? `0 0 10px ${currentTheme.primaryNeon}` : 'none'
                    }}
                  >
                    <div className="text-xs font-bold leading-tight">{pos.label}</div>
                    <div className={`text-[9px] mt-0.5 leading-tight ${isSelected ? 'text-black/80 font-medium' : 'text-slate-500'}`}>
                      {pos.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Cybernetic Theme Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.primaryNeon }} />
              <span>Cyber Theme Presets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {themesList.map(thm => {
                const isSelected = settings.theme === thm.id;
                return (
                  <button
                    key={thm.id}
                    onClick={() => onUpdateSettings({ theme: thm.id })}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/[0.08] border-cyan-400/50 shadow-md'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div 
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: thm.color,
                        boxShadow: `0 0 10px ${thm.color}`
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{thm.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{thm.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Bead Physical Styling */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" style={{ color: currentTheme.primaryNeon }} />
              <span>Physical Bead Material & Shader</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {beadStyles.map(bs => {
                const isSelected = settings.beadStyle === bs.id;
                return (
                  <button
                    key={bs.id}
                    onClick={() => onUpdateSettings({ beadStyle: bs.id })}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/[0.08] border-cyan-400/50 shadow-md'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{bs.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{bs.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Sound Pack & Tactile Audio Feedback */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" style={{ color: currentTheme.primaryNeon }} />
                <span>Tactile Audio Synthesizer</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-tabular">
                Volume: {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>

            {/* Volume Slider */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.soundVolume}
              onChange={e => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            {/* Sound Packs List */}
            <div className="space-y-1.5 mt-2">
              {soundPacks.map(sp => {
                const isSelected = settings.soundPack === sp.id;
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      onUpdateSettings({ soundPack: sp.id });
                      handleTestSound(sp.id);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/[0.08] border-cyan-400/40'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block">{sp.name}</span>
                      <span className="text-[10px] text-slate-400">{sp.desc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestSound(sp.id);
                      }}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 hover:text-white font-mono-tabular transition-colors shrink-0"
                    >
                      Test Sound
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Drag-to-Pull Sensitivity & Tension */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Strand Drag Tension (Sensitivity)</span>
              <span className="text-slate-400 font-mono-tabular">
                {settings.dragSensitivity <= 36 ? 'Light' : settings.dragSensitivity >= 60 ? 'Heavy' : 'Balanced'} ({settings.dragSensitivity}px)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Downwards displacement required to snap and advance the next bead.
            </p>
            <input
              type="range"
              min={32}
              max={68}
              step={4}
              value={settings.dragSensitivity}
              onChange={e => onUpdateSettings({ dragSensitivity: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 6. Haptic Vibration Feedback */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-slate-300" />
              <div>
                <h3 className="text-xs font-bold text-white">Haptic Vibration Tick</h3>
                <p className="text-[11px] text-slate-400">
                  Crisp physical vibration on bead snap and lap completion
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !settings.hapticEnabled;
                onUpdateSettings({ hapticEnabled: nextVal });
                if (nextVal) triggerHaptic('snap');
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.hapticEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 7. Heavy Vibration for Free Hand Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-bold text-white">Heavy Vibration (Free Hand)</h3>
                <p className="text-[11px] text-slate-400">
                  Deep multi-pulse tactile bursts for automated bead movement
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !settings.heavyVibration;
                onUpdateSettings({ heavyVibration: nextVal });
                if (nextVal) triggerHaptic('heavy');
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.heavyVibration ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.heavyVibration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-center bg-black/30">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-black transition-all cursor-pointer active:scale-98"
            style={{ backgroundColor: currentTheme.primaryNeon }}
          >
            Apply & Return to Tasbih
          </button>
        </div>
      </div>
    </div>
  );
};
