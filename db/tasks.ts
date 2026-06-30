import type { SQLiteDatabase } from 'expo-sqlite';

import { generateId, nowIso, toDateString } from '@/lib/dates';
import { nextRecurrenceDate, type RecurrenceRule } from '@/lib/recurrence';
import {
  cancelNotification,
  scheduleTaskReminder,
} from '@/lib/notifications';
import type { Task, TaskInput, TaskFilter } from '@/lib/types';

function rowToTask(row: Task): Task {
  return row;
}

export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const rows = await db.getAllAsync<Task>(
    `SELECT * FROM tasks ORDER BY sort_order ASC, created_at DESC`,
  );
  return rows.map(rowToTask);
}

export async function getTaskById(
  db: SQLiteDatabase,
  id: string,
): Promise<Task | null> {
  return db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', id);
}

export async function getInboxTasks(db: SQLiteDatabase): Promise<Task[]> {
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks WHERE inbox = 1 AND status = 'pending'
     ORDER BY created_at DESC`,
  );
}

export async function getTodayTasks(db: SQLiteDatabase): Promise<{
  overdue: Task[];
  today: Task[];
  evening: Task[];
}> {
  const today = toDateString();
  const all = await db.getAllAsync<Task>(
    `SELECT * FROM tasks WHERE status = 'pending' AND inbox = 0
     ORDER BY sort_order ASC, due_time ASC, created_at ASC`,
  );

  const overdue = all.filter(
    (t) => t.due_date && t.due_date < today && !t.evening,
  );
  const overdueIds = new Set(overdue.map((t) => t.id));
  const todayTasks = all.filter(
    (t) =>
      !t.evening &&
      !overdueIds.has(t.id) &&
      (t.scheduled_date === today || t.due_date === today),
  );
  const evening = all.filter((t) => t.evening === 1);

  return { overdue, today: todayTasks, evening };
}

export async function getFilteredTasks(
  db: SQLiteDatabase,
  filter: TaskFilter,
): Promise<Task[]> {
  const today = toDateString();
  if (filter === 'done') {
    return db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE status = 'completed'
       ORDER BY completed_at DESC`,
    );
  }
  if (filter === 'today') {
    const { overdue, today: todayTasks, evening } = await getTodayTasks(db);
    return [...overdue, ...todayTasks, ...evening];
  }
  if (filter === 'upcoming') {
    return db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE status = 'pending' AND inbox = 0
       AND (scheduled_date > ? OR due_date > ?)
       ORDER BY COALESCE(scheduled_date, due_date) ASC`,
      today,
      today,
    );
  }
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks WHERE inbox = 0
     ORDER BY status ASC, sort_order ASC, created_at DESC`,
  );
}

export async function getTasksForDate(
  db: SQLiteDatabase,
  dateStr: string,
): Promise<Task[]> {
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks WHERE status = 'pending' AND inbox = 0
     AND (scheduled_date = ? OR due_date = ?)
     ORDER BY sort_order ASC`,
    dateStr,
    dateStr,
  );
}

export async function getUnscheduledWeekTasks(
  db: SQLiteDatabase,
): Promise<Task[]> {
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks WHERE status = 'pending' AND inbox = 0
     AND scheduled_date IS NULL AND due_date IS NULL
     ORDER BY created_at DESC`,
  );
}

export async function createTask(
  db: SQLiteDatabase,
  input: TaskInput,
): Promise<Task> {
  const id = generateId();
  const now = nowIso();
  const inbox = input.inbox ? 1 : 0;
  const evening = input.evening ? 1 : 0;

  let notificationId: string | null = null;
  if (input.due_date && !input.inbox) {
    notificationId = await scheduleTaskReminder(
      id,
      input.title,
      input.due_date,
      input.due_time ?? null,
    );
  }

  await db.runAsync(
    `INSERT INTO tasks (
      id, title, notes, status, priority, inbox, scheduled_date, due_date,
      due_time, evening, recurrence_rule, notification_id, sort_order,
      completed_at, created_at, updated_at
    ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)`,
    id,
    input.title.trim(),
    input.notes ?? null,
    input.priority ?? 0,
    inbox,
    input.scheduled_date ?? null,
    input.due_date ?? null,
    input.due_time ?? null,
    evening,
    input.recurrence_rule ?? null,
    notificationId,
    now,
    now,
  );

  const task = await getTaskById(db, id);
  return task!;
}

export async function updateTask(
  db: SQLiteDatabase,
  id: string,
  input: Partial<TaskInput>,
): Promise<void> {
  const existing = await getTaskById(db, id);
  if (!existing) return;

  const title = input.title?.trim() ?? existing.title;
  const notes = input.notes !== undefined ? input.notes : existing.notes;
  const priority = input.priority ?? existing.priority;
  const inbox = input.inbox !== undefined ? (input.inbox ? 1 : 0) : existing.inbox;
  const scheduled_date =
    input.scheduled_date !== undefined
      ? input.scheduled_date
      : existing.scheduled_date;
  const due_date =
    input.due_date !== undefined ? input.due_date : existing.due_date;
  const due_time =
    input.due_time !== undefined ? input.due_time : existing.due_time;
  const evening =
    input.evening !== undefined ? (input.evening ? 1 : 0) : existing.evening;
  const recurrence_rule =
    input.recurrence_rule !== undefined
      ? input.recurrence_rule
      : existing.recurrence_rule;

  await cancelNotification(existing.notification_id);
  let notificationId: string | null = null;
  if (due_date && !inbox && existing.status === 'pending') {
    notificationId = await scheduleTaskReminder(id, title, due_date, due_time);
  }

  await db.runAsync(
    `UPDATE tasks SET
      title = ?, notes = ?, priority = ?, inbox = ?, scheduled_date = ?,
      due_date = ?, due_time = ?, evening = ?, recurrence_rule = ?,
      notification_id = ?, updated_at = ?
     WHERE id = ?`,
    title,
    notes,
    priority,
    inbox,
    scheduled_date,
    due_date,
    due_time,
    evening,
    recurrence_rule,
    notificationId,
    nowIso(),
    id,
  );
}

export async function completeTask(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  const task = await getTaskById(db, id);
  if (!task) return;

  await cancelNotification(task.notification_id);
  await db.runAsync(
    `UPDATE tasks SET status = 'completed', completed_at = ?, notification_id = NULL, updated_at = ?
     WHERE id = ?`,
    nowIso(),
    nowIso(),
    id,
  );

  if (task.recurrence_rule && task.due_date) {
    const nextDate = nextRecurrenceDate(
      task.due_date,
      task.recurrence_rule as RecurrenceRule,
    );
    await createTask(db, {
      title: task.title,
      notes: task.notes,
      priority: task.priority,
      due_date: nextDate,
      scheduled_date: nextDate,
      due_time: task.due_time,
      evening: task.evening === 1,
      recurrence_rule: task.recurrence_rule,
    });
  }
}

export async function uncompleteTask(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  const task = await getTaskById(db, id);
  if (!task) return;

  let notificationId: string | null = null;
  if (task.due_date) {
    notificationId = await scheduleTaskReminder(
      id,
      task.title,
      task.due_date,
      task.due_time,
    );
  }

  await db.runAsync(
    `UPDATE tasks SET status = 'pending', completed_at = NULL, notification_id = ?, updated_at = ?
     WHERE id = ?`,
    notificationId,
    nowIso(),
    id,
  );
}

export async function deleteTask(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  const task = await getTaskById(db, id);
  if (task) await cancelNotification(task.notification_id);
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}

export async function snoozeTask(
  db: SQLiteDatabase,
  id: string,
  days: number,
): Promise<void> {
  const task = await getTaskById(db, id);
  if (!task) return;

  const base = task.scheduled_date ?? task.due_date ?? toDateString();
  const next = new Date(base + 'T12:00:00');
  next.setDate(next.getDate() + days);
  const nextStr = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;

  await updateTask(db, id, {
    scheduled_date: nextStr,
    due_date: nextStr,
    evening: false,
  });
}

export async function scheduleTaskToDate(
  db: SQLiteDatabase,
  id: string,
  dateStr: string,
): Promise<void> {
  await updateTask(db, id, {
    inbox: false,
    scheduled_date: dateStr,
    due_date: dateStr,
    evening: false,
  });
}

export async function moveToInbox(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  await updateTask(db, id, {
    inbox: true,
    scheduled_date: null,
    due_date: null,
    evening: false,
  });
}

export async function getCompletedSince(
  db: SQLiteDatabase,
  sinceDate: string,
): Promise<Task[]> {
  return db.getAllAsync<Task>(
    `SELECT * FROM tasks WHERE status = 'completed' AND completed_at >= ?
     ORDER BY completed_at DESC`,
    sinceDate,
  );
}

export async function getOpenTaskCount(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM tasks WHERE status = 'pending'`,
  );
  return row?.count ?? 0;
}
