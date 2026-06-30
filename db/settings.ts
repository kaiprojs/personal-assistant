import type { SQLiteDatabase } from 'expo-sqlite';

import type { ThemePreference } from '@/lib/types';

export async function getSetting(
  db: SQLiteDatabase,
  key: string,
): Promise<string | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    key,
  );
  return row?.value ?? null;
}

export async function setSetting(
  db: SQLiteDatabase,
  key: string,
  value: string,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    value,
  );
}

export async function getThemePreference(
  db: SQLiteDatabase,
): Promise<ThemePreference> {
  const value = await getSetting(db, 'theme_preference');
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'dark';
}

export async function setThemePreference(
  db: SQLiteDatabase,
  preference: ThemePreference,
): Promise<void> {
  await setSetting(db, 'theme_preference', preference);
}
