import type { SQLiteDatabase } from 'expo-sqlite';

import { nowIso, startOfWeek, toDateString } from '@/lib/dates';
import type {
  BalanceCheckin,
  EveningReflection,
  EveningReflectionInput,
  PrimaryFocus,
} from '@/lib/types';

export async function getPrimaryFocus(
  db: SQLiteDatabase,
): Promise<PrimaryFocus | null> {
  const row = await db.getFirstAsync<{
    title: string;
    description: string | null;
    progress: number;
    updated_at: string;
  }>('SELECT title, description, progress, updated_at FROM primary_focus WHERE id = 1');

  if (!row || !row.title.trim()) return null;
  return { ...row, progress: row.progress ?? 0 };
}

export async function setPrimaryFocus(
  db: SQLiteDatabase,
  title: string,
  description: string | null,
  progress?: number,
): Promise<void> {
  const now = nowIso();
  const existing = await db.getFirstAsync<{ progress: number }>(
    'SELECT progress FROM primary_focus WHERE id = 1',
  );
  const nextProgress = progress ?? existing?.progress ?? 0;
  await db.runAsync(
    `INSERT INTO primary_focus (id, title, description, progress, updated_at)
     VALUES (1, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       description = excluded.description,
       progress = excluded.progress,
       updated_at = excluded.updated_at`,
    title.trim(),
    description?.trim() || null,
    nextProgress,
    now,
  );
}

export async function setPrimaryFocusProgress(
  db: SQLiteDatabase,
  progress: number,
): Promise<void> {
  await db.runAsync(
    `UPDATE primary_focus SET progress = ?, updated_at = ? WHERE id = 1`,
    Math.max(0, Math.min(100, progress)),
    nowIso(),
  );
}

export async function clearPrimaryFocus(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(
    `UPDATE primary_focus SET title = '', description = NULL, updated_at = ? WHERE id = 1`,
    nowIso(),
  );
}

export async function getEveningReflection(
  db: SQLiteDatabase,
  dateStr: string = toDateString(),
): Promise<EveningReflection | null> {
  return db.getFirstAsync<EveningReflection>(
    'SELECT * FROM evening_reflections WHERE log_date = ?',
    dateStr,
  );
}

export async function saveEveningReflection(
  db: SQLiteDatabase,
  input: EveningReflectionInput,
  dateStr: string = toDateString(),
): Promise<void> {
  const existing = await getEveningReflection(db, dateStr);
  const now = nowIso();

  if (existing) {
    await db.runAsync(
      `UPDATE evening_reflections SET
        honored_god = ?, made_life_easier = ?, problem_solved = ?,
        learned = ?, grateful = ?, improve_tomorrow = ?, updated_at = ?
       WHERE log_date = ?`,
      input.honored_god ?? existing.honored_god,
      input.made_life_easier ?? existing.made_life_easier,
      input.problem_solved ?? existing.problem_solved,
      input.learned ?? existing.learned,
      input.grateful ?? existing.grateful,
      input.improve_tomorrow ?? existing.improve_tomorrow,
      now,
      dateStr,
    );
    return;
  }

  await db.runAsync(
    `INSERT INTO evening_reflections (
      log_date, honored_god, made_life_easier, problem_solved,
      learned, grateful, improve_tomorrow, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    dateStr,
    input.honored_god ?? null,
    input.made_life_easier ?? null,
    input.problem_solved ?? null,
    input.learned ?? null,
    input.grateful ?? null,
    input.improve_tomorrow ?? null,
    now,
    now,
  );
}

export async function hasEveningReflectionToday(
  db: SQLiteDatabase,
): Promise<boolean> {
  const row = await getEveningReflection(db);
  if (!row) return false;
  return !!(
    row.honored_god ||
    row.made_life_easier ||
    row.problem_solved ||
    row.learned ||
    row.grateful ||
    row.improve_tomorrow
  );
}

export async function getBalanceCheckin(
  db: SQLiteDatabase,
  weekStart?: string,
): Promise<BalanceCheckin | null> {
  const ws = weekStart ?? toDateString(startOfWeek());
  const row = await db.getFirstAsync<{
    week_start: string;
    ratings: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM balance_checkins WHERE week_start = ?', ws);

  if (!row) return null;
  return {
    ...row,
    ratings: JSON.parse(row.ratings) as Record<string, number>,
  };
}

export async function saveBalanceCheckin(
  db: SQLiteDatabase,
  ratings: Record<string, number>,
  notes: string | null,
  weekStart?: string,
): Promise<void> {
  const ws = weekStart ?? toDateString(startOfWeek());
  const now = nowIso();
  const ratingsJson = JSON.stringify(ratings);

  await db.runAsync(
    `INSERT INTO balance_checkins (week_start, ratings, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(week_start) DO UPDATE SET
       ratings = excluded.ratings,
       notes = excluded.notes,
       updated_at = excluded.updated_at`,
    ws,
    ratingsJson,
    notes?.trim() || null,
    now,
    now,
  );
}

export async function getAllEveningReflections(
  db: SQLiteDatabase,
): Promise<EveningReflection[]> {
  return db.getAllAsync<EveningReflection>(
    'SELECT * FROM evening_reflections ORDER BY log_date DESC',
  );
}

export async function getAllBalanceCheckins(
  db: SQLiteDatabase,
): Promise<BalanceCheckin[]> {
  const rows = await db.getAllAsync<{
    week_start: string;
    ratings: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM balance_checkins ORDER BY week_start DESC');

  return rows.map((row) => ({
    ...row,
    ratings: JSON.parse(row.ratings) as Record<string, number>,
  }));
}
