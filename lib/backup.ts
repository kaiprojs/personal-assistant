import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { SQLiteDatabase } from 'expo-sqlite';

import * as lifeProfileRepo from '@/db/life-profile';
import * as osRepo from '@/db/personal-os';
import type { BackupData, Habit, HabitLog, Task } from '@/lib/types';
import { nowIso } from '@/lib/dates';
import type { LifeProfileKey } from '@/lib/life-profile';

const BACKUP_VERSION = 3;

export async function exportBackup(db: SQLiteDatabase): Promise<void> {
  const tasks = await db.getAllAsync<Task>('SELECT * FROM tasks');
  const habits = await db.getAllAsync<Habit>('SELECT * FROM habits');
  const habitLogs = await db.getAllAsync<HabitLog>('SELECT * FROM habit_logs');
  const settingsRows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT * FROM settings',
  );
  const [primaryFocus, eveningReflections, balanceCheckins, domainState, profiles] =
    await Promise.all([
      osRepo.getPrimaryFocus(db),
      osRepo.getAllEveningReflections(db),
      osRepo.getAllBalanceCheckins(db),
      lifeProfileRepo.getAllDomainState(db),
      lifeProfileRepo.loadLifeProfiles(db),
    ]);

  const settings: Record<string, string> = {};
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }

  const lifeProfiles: Record<string, unknown> = {};
  for (const key of Object.keys(profiles) as LifeProfileKey[]) {
    lifeProfiles[key] = profiles[key];
  }

  const backup: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: nowIso(),
    tasks,
    habits,
    habitLogs,
    settings,
    primaryFocus,
    eveningReflections,
    balanceCheckins,
    domainState,
    lifeProfiles,
  };

  const fileName = `personal-assistant-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true });
  file.write(JSON.stringify(backup, null, 2));

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export backup',
    });
  }
}

export async function importBackup(db: SQLiteDatabase): Promise<boolean> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) return false;

  const file = new File(result.assets[0].uri);
  const content = await file.text();
  const backup = JSON.parse(content) as BackupData;

  if (!backup.version || !backup.tasks) {
    throw new Error('Invalid backup file');
  }

  await db.execAsync(`
    DELETE FROM habit_logs;
    DELETE FROM habits;
    DELETE FROM tasks;
    DELETE FROM settings;
    DELETE FROM evening_reflections;
    DELETE FROM balance_checkins;
    DELETE FROM domain_state;
  `);

  for (const task of backup.tasks) {
    await db.runAsync(
      `INSERT INTO tasks (
        id, title, notes, status, priority, inbox, scheduled_date, due_date,
        due_time, evening, recurrence_rule, notification_id, sort_order,
        completed_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      task.id,
      task.title,
      task.notes,
      task.status,
      task.priority,
      task.inbox,
      task.scheduled_date,
      task.due_date,
      task.due_time,
      task.evening,
      task.recurrence_rule,
      task.notification_id,
      task.sort_order,
      task.completed_at,
      task.created_at,
      task.updated_at,
    );
  }

  for (const habit of backup.habits) {
    await db.runAsync(
      `INSERT INTO habits (id, title, icon, color, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      habit.id,
      habit.title,
      habit.icon,
      habit.color,
      habit.sort_order,
      habit.created_at,
    );
  }

  for (const log of backup.habitLogs) {
    await db.runAsync(
      `INSERT INTO habit_logs (id, habit_id, log_date, completed)
       VALUES (?, ?, ?, ?)`,
      log.id,
      log.habit_id,
      log.log_date,
      log.completed,
    );
  }

  for (const [key, value] of Object.entries(backup.settings ?? {})) {
    await db.runAsync(
      'INSERT INTO settings (key, value) VALUES (?, ?)',
      key,
      value,
    );
  }

  if (backup.primaryFocus?.title) {
    await osRepo.setPrimaryFocus(
      db,
      backup.primaryFocus.title,
      backup.primaryFocus.description,
      backup.primaryFocus.progress,
    );
  } else {
    await osRepo.clearPrimaryFocus(db);
  }

  for (const reflection of backup.eveningReflections ?? []) {
    await db.runAsync(
      `INSERT INTO evening_reflections (
        log_date, honored_god, made_life_easier, problem_solved,
        learned, grateful, improve_tomorrow, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      reflection.log_date,
      reflection.honored_god,
      reflection.made_life_easier,
      reflection.problem_solved,
      reflection.learned,
      reflection.grateful,
      reflection.improve_tomorrow,
      reflection.created_at,
      reflection.updated_at,
    );
  }

  for (const checkin of backup.balanceCheckins ?? []) {
    await osRepo.saveBalanceCheckin(
      db,
      checkin.ratings,
      checkin.notes,
      checkin.week_start,
    );
  }

  if (backup.domainState?.length) {
    await lifeProfileRepo.replaceAllDomainState(db, backup.domainState);
  }

  if (backup.lifeProfiles) {
    for (const [key, value] of Object.entries(backup.lifeProfiles)) {
      if (value && typeof value === 'object') {
        await lifeProfileRepo.saveLifeProfile(
          db,
          key as LifeProfileKey,
          value as never,
        );
      }
    }
  }

  return true;
}
