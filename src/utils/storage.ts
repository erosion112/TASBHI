import { TasbihSettings, UserStats, ZikrItem } from '../types';
import { DEFAULT_ADHKAR } from '../data/adhkar';

const SETTINGS_KEY = 'tasbih_cyber_settings_v1';
const STATS_KEY = 'tasbih_cyber_stats_v1';
const CUSTOM_ADHKAR_KEY = 'tasbih_cyber_custom_adhkar_v1';
const SESSION_KEY = 'tasbih_cyber_session_v1';

export const DEFAULT_SETTINGS: TasbihSettings = {
  volumeKeysEnabled: true,
  soundPack: 'mechanical-snap',
  soundVolume: 0.85,
  hapticEnabled: true,
  heavyVibration: true,
  beadStyle: 'cyber-orb',
  theme: 'cyber-cyan',
  dragSensitivity: 48,
  vocalCountingEnabled: false,
  stealthModeEnabled: false,
  strandPosition: 'left',
  freeHandSpeedMs: 1200
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadSettings(): TasbihSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TasbihSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadUserStats(): UserStats {
  const today = getTodayDateString();
  const defaultStats: UserStats = {
    currentStreak: 1,
    bestStreak: 1,
    lastActiveDate: today,
    totalDhikrCount: 0,
    dhikrBreakdown: {},
    dailyHistory: { [today]: 0 }
  };

  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return { ...defaultStats, ...parsed };
  } catch {
    return defaultStats;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function recordDhikrIncrement(zikrId: string, stats: UserStats): UserStats {
  const today = getTodayDateString();
  let currentStreak = stats.currentStreak || 1;
  const lastActive = stats.lastActiveDate;

  if (lastActive !== today) {
    // Check if yesterday was last active date
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak += 1;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  const bestStreak = Math.max(stats.bestStreak || 1, currentStreak);
  const totalDhikrCount = (stats.totalDhikrCount || 0) + 1;

  const dhikrBreakdown = { ...stats.dhikrBreakdown };
  dhikrBreakdown[zikrId] = (dhikrBreakdown[zikrId] || 0) + 1;

  const dailyHistory = { ...stats.dailyHistory };
  dailyHistory[today] = (dailyHistory[today] || 0) + 1;

  const newStats: UserStats = {
    currentStreak,
    bestStreak,
    lastActiveDate: today,
    totalDhikrCount,
    dhikrBreakdown,
    dailyHistory
  };

  saveUserStats(newStats);
  return newStats;
}

export function loadCustomAdhkar(): ZikrItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_ADHKAR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomAdhkar(items: ZikrItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_ADHKAR_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export interface SessionState {
  currentCount: number;
  currentCycle: number;
  selectedZikrId: string;
  currentTarget: number;
}

export function loadSessionState(): SessionState {
  const defaultState: SessionState = {
    currentCount: 0,
    currentCycle: 1,
    selectedZikrId: DEFAULT_ADHKAR[0].id,
    currentTarget: DEFAULT_ADHKAR[0].defaultTarget
  };

  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveSessionState(state: SessionState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
