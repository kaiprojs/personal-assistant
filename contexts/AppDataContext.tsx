import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import * as habitRepo from '@/db/habits';
import * as lifeProfileRepo from '@/db/life-profile';
import * as osRepo from '@/db/personal-os';
import * as taskRepo from '@/db/tasks';
import { exportBackup, importBackup } from '@/lib/backup';
import { DEFAULT_PROFILES, type LifeProfileKey, type LifeProfiles } from '@/lib/life-profile';
import { setupAndroidChannel } from '@/lib/notifications';
import type {
  BalanceCheckin,
  EveningReflection,
  EveningReflectionInput,
  Habit,
  HabitInput,
  PrimaryFocus,
  Task,
  TaskFilter,
  TaskInput,
} from '@/lib/types';

interface TodayBuckets {
  overdue: Task[];
  today: Task[];
  evening: Task[];
}

interface AppDataContextValue {
  loading: boolean;
  tasks: Task[];
  inboxTasks: Task[];
  todayBuckets: TodayBuckets;
  habits: Habit[];
  habitDoneToday: Record<string, boolean>;
  habitWeekCounts: Record<string, number>;
  primaryFocus: PrimaryFocus | null;
  hasReflectionToday: boolean;
  refresh: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<Task>;
  updateTask: (id: string, input: Partial<TaskInput>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  snoozeTask: (id: string, days: number) => Promise<void>;
  scheduleTaskToDate: (id: string, dateStr: string) => Promise<void>;
  moveToInbox: (id: string) => Promise<void>;
  getFilteredTasks: (filter: TaskFilter) => Promise<Task[]>;
  getTasksForDate: (dateStr: string) => Promise<Task[]>;
  getUnscheduledWeekTasks: () => Promise<Task[]>;
  getCompletedSince: (sinceDate: string) => Promise<Task[]>;
  getOpenTaskCount: () => Promise<number>;
  createHabit: (input: HabitInput) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitToday: (id: string) => Promise<void>;
  exportBackup: () => Promise<void>;
  importBackup: () => Promise<boolean>;
  setPrimaryFocus: (title: string, description: string | null) => Promise<void>;
  setPrimaryFocusProgress: (progress: number) => Promise<void>;
  clearPrimaryFocus: () => Promise<void>;
  saveEveningReflection: (
    input: EveningReflectionInput,
    dateStr?: string,
  ) => Promise<void>;
  getEveningReflection: (dateStr?: string) => Promise<EveningReflection | null>;
  getAllEveningReflections: () => Promise<EveningReflection[]>;
  getBalanceCheckin: (weekStart?: string) => Promise<BalanceCheckin | null>;
  saveBalanceCheckin: (
    ratings: Record<string, number>,
    notes: string | null,
    weekStart?: string,
  ) => Promise<void>;
  lifeProfile: LifeProfiles;
  updateLifeProfile: <K extends LifeProfileKey>(
    key: K,
    value: LifeProfiles[K],
  ) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inboxTasks, setInboxTasks] = useState<Task[]>([]);
  const [todayBuckets, setTodayBuckets] = useState<TodayBuckets>({
    overdue: [],
    today: [],
    evening: [],
  });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitDoneToday, setHabitDoneToday] = useState<Record<string, boolean>>(
    {},
  );
  const [habitWeekCounts, setHabitWeekCounts] = useState<
    Record<string, number>
  >({});
  const [primaryFocus, setPrimaryFocusState] = useState<PrimaryFocus | null>(
    null,
  );
  const [hasReflectionToday, setHasReflectionToday] = useState(false);
  const [lifeProfile, setLifeProfile] = useState<LifeProfiles>(DEFAULT_PROFILES);

  const refresh = useCallback(async () => {
    const [allTasks, inbox, today, habitList, focus, reflectionDone, profiles] =
      await Promise.all([
        taskRepo.getTasks(db),
        taskRepo.getInboxTasks(db),
        taskRepo.getTodayTasks(db),
        habitRepo.getHabits(db),
        osRepo.getPrimaryFocus(db),
        osRepo.hasEveningReflectionToday(db),
        lifeProfileRepo.loadLifeProfiles(db),
      ]);

    const doneMap: Record<string, boolean> = {};
    const weekMap: Record<string, number> = {};
    await Promise.all(
      habitList.map(async (h) => {
        doneMap[h.id] = await habitRepo.isHabitDoneToday(db, h.id);
        weekMap[h.id] = await habitRepo.getWeekCompletionCount(db, h.id);
      }),
    );

    setTasks(allTasks);
    setInboxTasks(inbox);
    setTodayBuckets(today);
    setHabits(habitList);
    setHabitDoneToday(doneMap);
    setHabitWeekCounts(weekMap);
    setPrimaryFocusState(focus);
    setHasReflectionToday(reflectionDone);
    setLifeProfile(profiles);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    setupAndroidChannel().then(() => refresh());
  }, [refresh]);

  const wrap =
    <T extends unknown[]>(fn: (...args: T) => Promise<unknown>) =>
    async (...args: T) => {
      await fn(...args);
      await refresh();
    };

  const value = useMemo<AppDataContextValue>(
    () => ({
      loading,
      tasks,
      inboxTasks,
      todayBuckets,
      habits,
      habitDoneToday,
      habitWeekCounts,
      primaryFocus,
      hasReflectionToday,
      refresh,
      createTask: async (input) => {
        const task = await taskRepo.createTask(db, input);
        await refresh();
        return task;
      },
      updateTask: wrap((id: string, input: Partial<TaskInput>) =>
        taskRepo.updateTask(db, id, input),
      ) as AppDataContextValue['updateTask'],
      completeTask: wrap((id: string) => taskRepo.completeTask(db, id)),
      uncompleteTask: wrap((id: string) => taskRepo.uncompleteTask(db, id)),
      deleteTask: wrap((id: string) => taskRepo.deleteTask(db, id)),
      snoozeTask: wrap((id: string, days: number) =>
        taskRepo.snoozeTask(db, id, days),
      ),
      scheduleTaskToDate: wrap((id: string, dateStr: string) =>
        taskRepo.scheduleTaskToDate(db, id, dateStr),
      ),
      moveToInbox: wrap((id: string) => taskRepo.moveToInbox(db, id)),
      getFilteredTasks: (filter) => taskRepo.getFilteredTasks(db, filter),
      getTasksForDate: (dateStr) => taskRepo.getTasksForDate(db, dateStr),
      getUnscheduledWeekTasks: () => taskRepo.getUnscheduledWeekTasks(db),
      getCompletedSince: (sinceDate) =>
        taskRepo.getCompletedSince(db, sinceDate),
      getOpenTaskCount: () => taskRepo.getOpenTaskCount(db),
      createHabit: async (input) => {
        const habit = await habitRepo.createHabit(db, input);
        await refresh();
        return habit;
      },
      deleteHabit: wrap((id: string) => habitRepo.deleteHabit(db, id)),
      toggleHabitToday: wrap((id: string) =>
        habitRepo.toggleHabitToday(db, id),
      ),
      exportBackup: async () => {
        await exportBackup(db);
      },
      importBackup: async () => {
        const ok = await importBackup(db);
        if (ok) await refresh();
        return ok;
      },
      setPrimaryFocus: wrap((title: string, description: string | null) =>
        osRepo.setPrimaryFocus(db, title, description),
      ) as AppDataContextValue['setPrimaryFocus'],
      setPrimaryFocusProgress: wrap((progress: number) =>
        osRepo.setPrimaryFocusProgress(db, progress),
      ) as AppDataContextValue['setPrimaryFocusProgress'],
      clearPrimaryFocus: wrap(() => osRepo.clearPrimaryFocus(db)),
      saveEveningReflection: async (input, dateStr) => {
        await osRepo.saveEveningReflection(db, input, dateStr);
        await refresh();
      },
      getEveningReflection: (dateStr) =>
        osRepo.getEveningReflection(db, dateStr),
      getAllEveningReflections: () => osRepo.getAllEveningReflections(db),
      getBalanceCheckin: (weekStart) =>
        osRepo.getBalanceCheckin(db, weekStart),
      saveBalanceCheckin: wrap(
        (
          ratings: Record<string, number>,
          notes: string | null,
          weekStart?: string,
        ) => osRepo.saveBalanceCheckin(db, ratings, notes, weekStart),
      ) as AppDataContextValue['saveBalanceCheckin'],
      lifeProfile,
      updateLifeProfile: async (key, value) => {
        await lifeProfileRepo.saveLifeProfile(db, key, value);
        setLifeProfile((prev) => ({ ...prev, [key]: value }));
      },
    }),
    [
      loading,
      tasks,
      inboxTasks,
      todayBuckets,
      habits,
      habitDoneToday,
      habitWeekCounts,
      primaryFocus,
      hasReflectionToday,
      lifeProfile,
      refresh,
      db,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
