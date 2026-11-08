import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  primaryNeon: string;      // Primary glow color (e.g. #00FF87)
  secondaryNeon: string;    // Gradient companion (e.g. #60EFFF)
  bgDark: string;           // #05080E
  bgCanvasGradient: string; // Gradient
  beadFillTop: string;
  beadFillBottom: string;
  beadGlow: string;
  beadRim: string;
  badgeBorder: string;
  textGlowClass: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  'cyber-emerald': {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    primaryNeon: '#00FF87',
    secondaryNeon: '#60EFFF',
    bgDark: '#050D0A',
    bgCanvasGradient: 'radial-gradient(circle at 50% 45%, #09231B 0%, #050D0A 70%, #020605 100%)',
    beadFillTop: '#60EFFF',
    beadFillBottom: '#00B862',
    beadGlow: 'rgba(0, 255, 135, 0.45)',
    beadRim: 'rgba(96, 239, 255, 0.9)',
    badgeBorder: 'rgba(0, 255, 135, 0.3)',
    textGlowClass: 'glow-emerald'
  },
  'cyber-cyan': {
    id: 'cyber-cyan',
    name: 'Neon Cyan',
    primaryNeon: '#00F2FE',
    secondaryNeon: '#4FACFE',
    bgDark: '#05080E',
    bgCanvasGradient: 'radial-gradient(circle at 50% 45%, #0B192A 0%, #05080E 70%, #020306 100%)',
    beadFillTop: '#4FACFE',
    beadFillBottom: '#00A3FF',
    beadGlow: 'rgba(0, 242, 254, 0.45)',
    beadRim: 'rgba(0, 242, 254, 0.95)',
    badgeBorder: 'rgba(0, 242, 254, 0.3)',
    textGlowClass: 'glow-cyan'
  },
  'cyber-amber': {
    id: 'cyber-amber',
    name: 'Solar Amber',
    primaryNeon: '#FFD700',
    secondaryNeon: '#FFA500',
    bgDark: '#0E0904',
    bgCanvasGradient: 'radial-gradient(circle at 50% 45%, #251605 0%, #0E0904 70%, #060402 100%)',
    beadFillTop: '#FFE566',
    beadFillBottom: '#D98200',
    beadGlow: 'rgba(255, 215, 0, 0.45)',
    beadRim: 'rgba(255, 215, 0, 0.9)',
    badgeBorder: 'rgba(255, 215, 0, 0.3)',
    textGlowClass: 'glow-amber'
  },
  'cyber-violet': {
    id: 'cyber-violet',
    name: 'Ethereal Violet',
    primaryNeon: '#BD00FF',
    secondaryNeon: '#00F2FE',
    bgDark: '#090510',
    bgCanvasGradient: 'radial-gradient(circle at 50% 45%, #1F0833 0%, #090510 70%, #040208 100%)',
    beadFillTop: '#E175FF',
    beadFillBottom: '#8500B8',
    beadGlow: 'rgba(189, 0, 255, 0.45)',
    beadRim: 'rgba(225, 117, 255, 0.9)',
    badgeBorder: 'rgba(189, 0, 255, 0.3)',
    textGlowClass: 'glow-violet'
  },
  'obsidian-matrix': {
    id: 'obsidian-matrix',
    name: 'Obsidian Stealth',
    primaryNeon: '#00F2FE',
    secondaryNeon: '#38BDF8',
    bgDark: '#040406',
    bgCanvasGradient: 'radial-gradient(circle at 50% 45%, #0B0E14 0%, #040406 80%, #000000 100%)',
    beadFillTop: '#7DD3FC',
    beadFillBottom: '#0284C7',
    beadGlow: 'rgba(56, 189, 248, 0.35)',
    beadRim: 'rgba(125, 211, 252, 0.85)',
    badgeBorder: 'rgba(56, 189, 248, 0.25)',
    textGlowClass: 'glow-cyan'
  }
};
