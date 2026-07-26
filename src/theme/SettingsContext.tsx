import { createContext, useContext, useState, ReactNode } from 'react';
import { getSetting, setSetting } from '../db/queries/settings';

interface SettingsContextValue {
  confirmDelete: boolean;
  setConfirmDelete: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  confirmDelete: true,
  setConfirmDelete: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [confirmDelete, setConfirmDeleteState] = useState(
    () => getSetting('confirmDelete') !== 'false'
  );

  const setConfirmDelete = (value: boolean) => {
    setConfirmDeleteState(value);
    setSetting('confirmDelete', value ? 'true' : 'false');
  };

  return (
    <SettingsContext.Provider value={{ confirmDelete, setConfirmDelete }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}