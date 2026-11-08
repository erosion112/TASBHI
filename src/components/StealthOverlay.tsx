import { EyeOff, X, Zap } from 'lucide-react';

interface StealthOverlayProps {
  isOpen: boolean;
  count: number;
  isFreeHandActive?: boolean;
  onIncrement: () => void;
  onToggleFreeHand?: () => void;
  onExit: () => void;
}

export const StealthOverlay: React.FC<StealthOverlayProps> = ({
  isOpen,
  count,
  isFreeHandActive = false,
  onIncrement,
  onToggleFreeHand,
  onExit
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between items-center p-6 select-none cursor-pointer"
      onClick={onIncrement}
    >
      {/* Top subtle hint */}
      <div 
        className="w-full flex items-center justify-between text-slate-800 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 text-xs text-zinc-700 font-mono-tabular">
          <EyeOff className="w-3.5 h-3.5" />
          <span>STEALTH POCKET MODE {isFreeHandActive ? '· AUTO ACTIVE' : ''}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onToggleFreeHand && (
            <button
              onClick={onToggleFreeHand}
              className={`p-2 rounded-full transition-colors ${
                isFreeHandActive ? 'bg-red-950 text-red-400' : 'bg-zinc-900 text-zinc-500'
              }`}
              title="Toggle Free Hand Auto"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onExit}
            className="p-2 rounded-full bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Exit Stealth Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ultra-low brightness OLED display */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-none">
        <span className="font-mono-tabular font-bold text-6xl text-zinc-800 tracking-tight select-none">
          {count}
        </span>
        <span className="text-[11px] text-zinc-800 tracking-widest mt-2 uppercase font-mono-tabular">
          {isFreeHandActive ? '⚡ Auto moving with heavy vibration' : 'Tap anywhere or press Vol Up/Down'}
        </span>
      </div>

      {/* Bottom exit button */}
      <button
        onClick={e => {
          e.stopPropagation();
          onExit();
        }}
        className="pointer-events-auto px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        Tap here to exit stealth mode
      </button>
    </div>
  );
};
