import { createContext, useContext, useState, ReactNode } from 'react';
import { getSetting, setSetting } from '../db/queries/settings';

interface SettingsContextValue {
  confirmDelete: boolean;
  setConfirmDelete: (value: boolean) => void;
  backgroundBlur: number;
  setBackgroundBlur: (value: number) => void;
}

const DEFAULT_BACKGROUND_BLUR = 15;

const SettingsContext = createContext<SettingsContextValue>({
  confirmDelete: true,
  setConfirmDelete: () => {},
  backgroundBlur: DEFAULT_BACKGROUND_BLUR,
  setBackgroundBlur: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [confirmDelete, setConfirmDeleteState] = useState(
    () => getSetting('confirmDelete') !== 'false'
  );

  const [backgroundBlur, setBackgroundBlurState] = useState(() => {
    const stored = getSetting('backgroundBlur');
    return stored !== null ? Number(stored) : DEFAULT_BACKGROUND_BLUR;
  });

  const setConfirmDelete = (value: boolean) => {
    setConfirmDeleteState(value);
    setSetting('confirmDelete', value ? 'true' : 'false');
  };

  const setBackgroundBlur = (value: number) => {
    setBackgroundBlurState(value);
    setSetting('backgroundBlur', String(value));
  };

  return (
    <SettingsContext.Provider
      value={{ confirmDelete, setConfirmDelete, backgroundBlur, setBackgroundBlur }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}