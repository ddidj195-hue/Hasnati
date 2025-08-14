import React, { createContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { Settings } from '../types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

const defaultSettings: Settings = {
  theme: 'system',
  prayerMethod: 'MWL', // Muslim World League as a default
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem('hasanati_settings');
      return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hasanati_settings', JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save settings to localStorage", error);
    }
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};