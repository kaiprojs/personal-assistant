import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { getThemePreference, setThemePreference } from '@/db/settings';
import { themes, type ColorScheme, type ThemeColors } from '@/lib/theme';
import type { ThemePreference } from '@/lib/types';

interface ThemeContextValue {
  colors: ThemeColors;
  colorScheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getThemePreference(db).then((value) => {
      setPreferenceState(value);
      setReady(true);
    });
  }, [db]);

  const colorScheme: ColorScheme =
    preference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const colors = themes[colorScheme];

  const setPreference = useCallback(
    async (next: ThemePreference) => {
      await setThemePreference(db, next);
      setPreferenceState(next);
    },
    [db],
  );

  const value = useMemo(
    () => ({ colors, colorScheme, preference, setPreference, ready }),
    [colors, colorScheme, preference, setPreference, ready],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
