import type { SQLiteDatabase } from 'expo-sqlite';

import { addDays, generateId, nowIso, toDateString } from '@/lib/dates';
import type { Habit, HabitInput, HabitLog } from '@/lib/types';

const HABIT_COLORS = [
  '#007AFF',
  '#34C759',
  '#FF9500',
  '#FF3B30',
  '#5856D6',
  '#FF2D55',
  '#5AC8FA',
];

export async function getHabits(db: SQLiteDatabase): Promise<Habit[]> {
  return db.getAllAsync<Habit>(
    'SELECT * FROM habits ORDER BY sort_order ASC, created_at ASC',
  );
}

export async function createHabit(
  db: SQLiteDatabase,
  input: HabitInput,
): Promise<Habit> {
  const id = generateId();
  const count = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM habits',
  );
  const color =
    input.color ??
    HABIT_COLORS[(count?.count ?? 0) % HABIT_COLORS.length];

  await db.runAsync(
    `INSERT INTO habits (id, title, icon, color, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    id,
    input.title.trim(),
    input.icon ?? 'checkmark-circle',
    color,
    count?.count ?? 0,
    nowIso(),
  );

  const habit = await db.getFirstAsync<Habit>(
    'SELECT * FROM habits WHERE id = ?',
    id,
  );
  return habit!;
}

export async function deleteHabit(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ?', id);
  await db.runAsync('DELETE FROM habits WHERE id = ?', id);
}

export async function getHabitLogsForWeek(
  db: SQLiteDatabase,
  habitId: string,
): Promise<HabitLog[]> {
  const start = toDateString(addDays(new Date(), -6));
  return db.getAllAsync<HabitLog>(
    `SELECT * FROM habit_logs WHERE habit_id = ? AND log_date >= ?
     ORDER BY log_date ASC`,
    habitId,
    start,
  );
}

export async function isHabitDoneToday(
  db: SQLiteDatabase,
  habitId: string,
): Promise<boolean> {
  const today = toDateString();
  const row = await db.getFirstAsync<HabitLog>(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND log_date = ?',
    habitId,
    today,
  );
  return !!row;
}

export async function toggleHabitToday(
  db: SQLiteDatabase,
  habitId: string,
): Promise<boolean> {
  const today = toDateString();
  const existing = await db.getFirstAsync<HabitLog>(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND log_date = ?',
    habitId,
    today,
  );

  if (existing) {
    await db.runAsync('DELETE FROM habit_logs WHERE id = ?', existing.id);
    return false;
  }

  await db.runAsync(
    'INSERT INTO habit_logs (id, habit_id, log_date, completed) VALUES (?, ?, ?, 1)',
    generateId(),
    habitId,
    today,
  );
  return true;
}

export async function getWeekCompletionCount(
  db: SQLiteDatabase,
  habitId: string,
): Promise<number> {
  const start = toDateString(addDays(new Date(), -6));
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM habit_logs
     WHERE habit_id = ? AND log_date >= ?`,
    habitId,
    start,
  );
  return row?.count ?? 0;
}
