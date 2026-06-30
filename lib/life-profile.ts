import {
  CAREER,
  CORE_VALUES,
  DAILY_VERSES,
  FAITH_ACTIVITIES,
  FINANCE,
  HEALTH_METRICS,
  LONG_TERM_GOALS,
  MEMORY_VERSE,
  MIND_COURSES,
  MIND_READING,
  MIND_SKILLS,
  MISSION,
  VISION,
} from '@/lib/personal-os';

export interface IdentityProfile {
  mission: string;
  vision: string;
  coreValues: string[];
  longTermGoals: string[];
}

export interface FaithReading {
  book: string;
  chapter: number;
  currentVerse: number;
  totalVerses: number;
}

export interface FaithActivity {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  done: boolean;
}

export interface FaithProfile {
  reading: FaithReading;
  memoryVerseIndex: number;
  activities: FaithActivity[];
}

export interface MindNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface MindProfile {
  currentBook: { title: string; author: string; progress: number };
  courses: { id: string; title: string; status: string; progress: number }[];
  skills: string[];
  notes: MindNote[];
}

export interface CareerProfile {
  role: string;
  goal: string;
  goalProgress: number;
  certifications: { id: string; title: string; status: string }[];
  resumeUpdated: string | null;
  jobOpportunities: number;
}

export interface FinanceProfile {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  savingsProgress: number;
  houseFundProgress: number;
  investmentAccounts: number;
}

export interface HealthProfile {
  metrics: Record<string, string>;
}

export interface LifeProfiles {
  identity: IdentityProfile;
  faith: FaithProfile;
  mind: MindProfile;
  career: CareerProfile;
  finance: FinanceProfile;
  health: HealthProfile;
}

export type LifeProfileKey = keyof LifeProfiles;

export const DEFAULT_PROFILES: LifeProfiles = {
  identity: {
    mission: MISSION,
    vision: VISION,
    coreValues: [...CORE_VALUES],
    longTermGoals: [...LONG_TERM_GOALS],
  },
  faith: {
    reading: {
      book: 'John',
      chapter: 15,
      currentVerse: 16,
      totalVerses: 23,
    },
    memoryVerseIndex: 1,
    activities: FAITH_ACTIVITIES.map((a, i) => ({
      id: `faith-act-${i}`,
      title: a.title,
      subtitle: a.subtitle,
      icon: a.icon,
      color: a.color,
      done: a.title === 'Church Attendance',
    })),
  },
  mind: {
    currentBook: {
      title: MIND_READING.title,
      author: MIND_READING.author,
      progress: MIND_READING.progress,
    },
    courses: MIND_COURSES.map((c, i) => ({
      id: `course-${i}`,
      title: c.title,
      status: c.status,
      progress: c.progress,
    })),
    skills: [...MIND_SKILLS],
    notes: [],
  },
  career: {
    role: CAREER.role,
    goal: CAREER.goal,
    goalProgress: CAREER.goalProgress,
    certifications: CAREER.certifications.map((c, i) => ({
      id: `cert-${i}`,
      title: c.title,
      status: c.status,
    })),
    resumeUpdated: null,
    jobOpportunities: 3,
  },
  finance: {
    month: FINANCE.month,
    income: FINANCE.income,
    expenses: FINANCE.expenses,
    savings: FINANCE.savings,
    savingsProgress: FINANCE.savingsProgress,
    houseFundProgress: FINANCE.houseFundProgress,
    investmentAccounts: 2,
  },
  health: {
    metrics: Object.fromEntries(HEALTH_METRICS.map((m) => [m.key, m.value])),
  },
};

export function getMemoryVerse(profile: FaithProfile) {
  const verses = DAILY_VERSES;
  const idx = profile.memoryVerseIndex % verses.length;
  return verses[idx] ?? MEMORY_VERSE;
}

export function getReadingProgress(profile: FaithProfile): number {
  const { currentVerse, totalVerses } = profile.reading;
  if (totalVerses <= 0) return 0;
  return Math.round((currentVerse / totalVerses) * 100);
}

export function formatReadingLabel(profile: FaithProfile): string {
  const { book, chapter } = profile.reading;
  return `${book} ${chapter}`;
}

export function currentMonthLabel(): string {
  const d = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
