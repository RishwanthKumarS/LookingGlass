import { createContext, useContext, useState, ReactNode } from 'react';
import { builtInThemes, ThemePreview } from './themeData';
import { getSetting, setSetting } from '../db/queries/settings';
import { pauseTrial, resumeTrial } from './trialManager';

const defaultTheme = builtInThemes.find((t) => t.id === 'midnight')!;

const ThemeContext = createContext<{ currentTheme: ThemePreview; selectTheme: (id: string) => void }>({
  currentTheme: defaultTheme,
  selectTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initialId = getSetting('currentThemeId') || 'midnight';
  const initialTheme = builtInThemes.find((t) => t.id === initialId) || defaultTheme;

  const [currentTheme, setCurrentTheme] = useState<ThemePreview>(initialTheme);

  const selectTheme = (themeId: string) => {
    if (themeId === currentTheme.id) return;
    const prevTheme = builtInThemes.find((t) => t.id === currentTheme.id);
    if (prevTheme?.isPremium) pauseTrial(prevTheme.id);
    const nextTheme = builtInThemes.find((t) => t.id === themeId);
    if (!nextTheme) return;
    if (nextTheme.isPremium) resumeTrial(themeId);
    setCurrentTheme(nextTheme);
    setSetting('currentThemeId', themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}