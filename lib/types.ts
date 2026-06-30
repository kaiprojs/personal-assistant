export type ThemePreference = 'system' | 'light' | 'dark';

export type TaskStatus = 'pending' | 'completed';

export type TaskFilter = 'all' | 'today' | 'upcoming' | 'done';

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: number;
  inbox: number;
  scheduled_date: string | null;
  due_date: string | null;
  due_time: string | null;
  evening: number;
  recurrence_rule: string | null;
  notification_id: string | null;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  log_date: string;
  completed: number;
}

export interface TaskInput {
  title: string;
  notes?: string | null;
  priority?: number;
  inbox?: boolean;
  scheduled_date?: string | null;
  due_date?: string | null;
  due_time?: string | null;
  evening?: boolean;
  recurrence_rule?: string | null;
}

export interface HabitInput {
  title: string;
  icon?: string;
  color?: string;
}

export interface PrimaryFocus {
  title: string;
  description: string | null;
  progress: number;
  updated_at: string;
}

export interface EveningReflection {
  log_date: string;
  honored_god: string | null;
  made_life_easier: string | null;
  problem_solved: string | null;
  learned: string | null;
  grateful: string | null;
  improve_tomorrow: string | null;
  created_at: string;
  updated_at: string;
}

export type EveningReflectionInput = Partial<
  Record<
    | 'honored_god'
    | 'made_life_easier'
    | 'problem_solved'
    | 'learned'
    | 'grateful'
    | 'improve_tomorrow',
    string
  >
>;

export interface BalanceCheckin {
  week_start: string;
  ratings: Record<string, number>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  settings: Record<string, string>;
  primaryFocus?: PrimaryFocus | null;
  eveningReflections?: EveningReflection[];
  balanceCheckins?: BalanceCheckin[];
  domainState?: { key: string; value: string; updated_at: string }[];
  lifeProfiles?: Record<string, unknown>;
}
