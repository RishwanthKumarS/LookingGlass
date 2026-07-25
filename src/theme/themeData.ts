export interface ThemePreview {
  id: string;
  name: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  isPremium: boolean;
  trialHours: number;
}

export const builtInThemes: ThemePreview[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    background: '#0d0d0f',
    surface: '#1a1a1d',
    accent: '#7cebff',
    text: '#f2f2f2',
    textMuted: '#9a9a9e',
    border: '#2a2a2e',
    isPremium: false,
    trialHours: 0,
  },
  {
    id: 'slate',
    name: 'Slate',
    background: '#14171a',
    surface: '#20242a',
    accent: '#5fd4c1',
    text: '#e6e8ea',
    textMuted: '#8d9296',
    border: '#2c3238',
    isPremium: false,
    trialHours: 0,
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    background: '#161616',
    surface: '#232323',
    accent: '#c9c9c9',
    text: '#f0f0f0',
    textMuted: '#8a8a8a',
    border: '#333333',
    isPremium: false,
    trialHours: 0,
  },
  {
    id: 'sakura',
    name: 'Sakura',
    background: '#fdf1f4',
    surface: '#fbe3ea',
    accent: '#e893ac',
    text: '#4a2e35',
    textMuted: '#9c7b83',
    border: '#f3cdd9',
    isPremium: true,
    trialHours: 12,
  },
  {
    id: 'parchment',
    name: 'Parchment',
    background: '#f2e8d5',
    surface: '#e8dcc3',
    accent: '#8a6f4b',
    text: '#3a3226',
    textMuted: '#7a6f5c',
    border: '#d9cba9',
    isPremium: true,
    trialHours: 12,
  },
  {
    id: 'retro-light',
    name: 'Retro Light',
    background: '#fdf3e3',
    surface: '#f7e3c4',
    accent: '#e0633f',
    text: '#2e2a25',
    textMuted: '#8a7d68',
    border: '#e8d3a8',
    isPremium: true,
    trialHours: 12,
  },
  {
    id: 'retro-dark',
    name: 'Retro Dark',
    background: '#171412',
    surface: '#2b241f',
    accent: '#e0955f',
    text: '#f0e6d8',
    textMuted: '#a89a86',
    border: '#3d342c',
    isPremium: true,
    trialHours: 12,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    background: '#0a0014',
    surface: '#160a24',
    accent: '#ff2fb0',
    text: '#e8e2ff',
    textMuted: '#8f7fae',
    border: '#2e1a44',
    isPremium: true,
    trialHours: 12,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    background: '#0a0f0a',
    surface: '#0f170f',
    accent: '#39ff6a',
    text: '#c8f5cf',
    textMuted: '#5c9464',
    border: '#1c2c1c',
    isPremium: true,
    trialHours: 12,
  },
];