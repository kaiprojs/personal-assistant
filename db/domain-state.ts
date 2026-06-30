import type { SQLiteDatabase } from 'expo-sqlite';

import { nowIso, toDateString } from '@/lib/dates';

export async function getDailyState<T extends Record<string, unknown>>(
  db: SQLiteDatabase,
  domain: string,
  dateStr: string = toDateString(),
): Promise<T | null> {
  const key = `${domain}_${dateStr}`;
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM domain_state WHERE key = ?',
    key,
  );
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

export async function setDailyState<T extends Record<string, unknown>>(
  db: SQLiteDatabase,
  domain: string,
  value: T,
  dateStr: string = toDateString(),
): Promise<void> {
  const key = `${domain}_${dateStr}`;
  await db.runAsync(
    `INSERT INTO domain_state (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    JSON.stringify(value),
    nowIso(),
  );
}

export async function getPersistentState<T>(
  db: SQLiteDatabase,
  key: string,
): Promise<T | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM domain_state WHERE key = ?',
    key,
  );
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

export async function setPersistentState<T>(
  db: SQLiteDatabase,
  key: string,
  value: T,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO domain_state (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    JSON.stringify(value),
    nowIso(),
  );
}
