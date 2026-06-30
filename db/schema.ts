import type { SQLiteDatabase } from 'expo-sqlite';

import { DEFAULT_HABITS } from '@/lib/personal-os';

export const DATABASE_NAME = 'personal_assistant.db';

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority INTEGER NOT NULL DEFAULT 0,
      inbox INTEGER NOT NULL DEFAULT 0,
      scheduled_date TEXT,
      due_date TEXT,
      due_time TEXT,
      evening INTEGER NOT NULL DEFAULT 0,
      recurrence_rule TEXT,
      notification_id TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'checkmark-circle',
      color TEXT NOT NULL DEFAULT '#007AFF',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      log_date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
      UNIQUE(habit_id, log_date)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS primary_focus (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      title TEXT NOT NULL DEFAULT '',
      description TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS evening_reflections (
      log_date TEXT PRIMARY KEY NOT NULL,
      honored_god TEXT,
      made_life_easier TEXT,
      problem_solved TEXT,
      learned TEXT,
      grateful TEXT,
      improve_tomorrow TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS balance_checkins (
      week_start TEXT PRIMARY KEY NOT NULL,
      ratings TEXT NOT NULL DEFAULT '{}',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS domain_state (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await migrateSchema(db);
  await seedPersonalOs(db);
}

async function migrateSchema(db: SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(primary_focus)',
  );
  if (!columns.some((c) => c.name === 'progress')) {
    await db.execAsync(
      'ALTER TABLE primary_focus ADD COLUMN progress INTEGER NOT NULL DEFAULT 0',
    );
  }
}

async function seedPersonalOs(db: SQLiteDatabase): Promise<void> {
  const focus = await db.getFirstAsync('SELECT id FROM primary_focus WHERE id = 1');
  if (!focus) {
    await db.runAsync(
      `INSERT INTO primary_focus (id, title, description, progress, updated_at)
       VALUES (1, 'Build my Personal Assistant App', 'Local-first life organizer for Kai', 75, ?)`,
      new Date().toISOString(),
    );
  }

  const habitCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM habits',
  );
  if ((habitCount?.count ?? 0) === 0) {
    const now = new Date().toISOString();
    for (let i = 0; i < DEFAULT_HABITS.length; i++) {
      const h = DEFAULT_HABITS[i];
      await db.runAsync(
        `INSERT INTO habits (id, title, icon, color, sort_order, created_at)
         VALUES (?, ?, 'checkmark-circle', ?, ?, ?)`,
        `${Date.now()}-${i}`,
        h.title,
        h.color,
        i,
        now,
      );
    }
  }
}
