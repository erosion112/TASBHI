export type ThemeMode = 
  | 'cyber-cyan' 
  | 'cyber-emerald' 
  | 'cyber-amber' 
  | 'cyber-violet' 
  | 'obsidian-matrix';

export type SoundPack = 
  | 'mechanical-snap' 
  | 'wooden-misbaha' 
  | 'crystal-chime' 
  | 'soft-pulse' 
  | 'silent';

export type BeadStyle = 
  | 'cyber-orb' 
  | 'luminescent-crystal' 
  | 'metallic-core' 
  | 'neon-ring';

export interface ZikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  defaultTarget: number;
  category: 'daily' | 'tasbih-fatimah' | 'forgiveness' | 'praise' | 'custom';
  isCustom?: boolean;
}

export type StrandPosition = 'left' | 'center' | 'right';

export interface TasbihSettings {
  volumeKeysEnabled: boolean;
  soundPack: SoundPack;
  soundVolume: number; // 0 to 1
  hapticEnabled: boolean;
  heavyVibration: boolean;
  beadStyle: BeadStyle;
  theme: ThemeMode;
  dragSensitivity: number; // 30 (sensitive) to 70 (high resistance)
  vocalCountingEnabled: boolean;
  stealthModeEnabled: boolean;
  strandPosition: StrandPosition;
  freeHandSpeedMs: number; // default 1200ms
}

export interface DhikrHistoryEntry {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalDhikrCount: number;
  dhikrBreakdown: Record<string, number>;
  dailyHistory: Record<string, number>; // date -> count
}
