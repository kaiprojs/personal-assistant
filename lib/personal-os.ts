export const USER_NAME = 'Kai';

export const MISSION =
  'To use the gifts God has given me to make people\'s lives a little easier and reflect Christ through the way I serve them.';

export const VISION =
  'A life where faith, excellence, and service come together — solving hard problems, building meaningful things, and leaving people better than I found them.';

export const LONG_TERM_GOALS = [
  'Becoming an exceptional networking engineer',
  'Becoming highly skilled in cybersecurity',
  'Building an IT consulting and cybersecurity company',
  'Investing in real estate',
  'Becoming known as someone who solves difficult problems',
  'Living a life that reflects Christ in character, work, and relationships',
];

export const CORE_VALUES = [
  'Faith',
  'Integrity',
  'Excellence',
  'Humility',
  'Curiosity',
  'Service',
  'Consistency',
];

export const LIFE_BALANCE_AREAS = [
  { key: 'god', label: 'Relationship with God', icon: 'heart' as const },
  { key: 'health', label: 'Health', icon: 'fitness' as const },
  { key: 'career', label: 'Career', icon: 'briefcase' as const },
  { key: 'education', label: 'Education', icon: 'school' as const },
  { key: 'projects', label: 'Building projects', icon: 'hammer' as const },
  { key: 'finances', label: 'Finances', icon: 'wallet' as const },
  { key: 'family', label: 'Family & friends', icon: 'people' as const },
  { key: 'church', label: 'Church responsibilities', icon: 'home' as const },
  { key: 'band', label: 'Band commitments', icon: 'musical-notes' as const },
  { key: 'rest', label: 'Rest', icon: 'bed' as const },
] as const;

export type BalanceAreaKey = (typeof LIFE_BALANCE_AREAS)[number]['key'];

export const DAILY_VERSES = [
  { reference: 'Proverbs 16:3', text: 'Commit to the Lord whatever you do, and he will establish your plans.' },
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
  { reference: 'Proverbs 27:17', text: 'As iron sharpens iron, so one person sharpens another.' },
  { reference: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart, as working for the Lord.' },
  { reference: 'Joshua 1:9', text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
  { reference: 'Micah 6:8', text: 'Act justly, love mercy, and walk humbly with your God.' },
  { reference: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.' },
  { reference: 'Matthew 5:16', text: 'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.' },
  { reference: 'Romans 12:2', text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.' },
  { reference: 'Isaiah 40:31', text: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles.' },
  { reference: '1 Corinthians 10:31', text: 'Whatever you do, do it all for the glory of God.' },
  { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
];

export const MEMORY_VERSE = {
  reference: 'Philippians 4:13',
  text: 'I can do all things through Christ who strengthens me.',
};

export const FAITH_CHECKLIST = [
  { key: 'devotion', label: 'Daily Devotion' },
  { key: 'bible', label: 'Bible Reading', subtitle: 'John 15' },
  { key: 'prayer', label: 'Prayer' },
] as const;

export const FAITH_ACTIVITIES = [
  { icon: 'home' as const, title: 'Church Attendance', subtitle: 'Wednesday Service — Attended', color: '#30D158' },
  { icon: 'heart' as const, title: 'Service Opportunities', subtitle: 'Help with Youth Ministry — May 24', color: '#BF5AF2' },
];

export const MIND_READING = {
  title: 'Atomic Habits',
  author: 'James Clear',
  progress: 46,
};

export const MIND_COURSES = [
  { title: 'CompTIA Security+', status: 'In Progress', progress: 35 },
];

export const MIND_SKILLS = ['Networking', 'Cybersecurity', 'Linux', 'Python'];

export const CAREER = {
  role: 'IT Support Technician',
  goal: 'Become a Network Engineer',
  goalProgress: 75,
  certifications: [
    { title: 'CompTIA Network+', status: 'In Progress' },
    { title: 'CCNA', status: 'Planned' },
  ],
};

export const BUILDER_TOOLS = [
  { icon: 'code-slash' as const, label: 'VS Code' },
  { icon: 'color-palette' as const, label: 'Figma' },
  { icon: 'logo-github' as const, label: 'GitHub' },
  { icon: 'document-text' as const, label: 'Notion' },
];

export const BUILDER_PROGRESS = [
  { key: 'ui', label: 'UI Design', done: true },
  { key: 'core', label: 'Core Features', done: true },
  { key: 'db', label: 'Database Setup', done: true },
  { key: 'ai', label: 'AI Integration', done: false },
];

export const CHARACTER_VIRTUES = [
  { key: 'self_control', label: 'Self-Control', subtitle: 'Stayed calm today' },
  { key: 'humility', label: 'Humility', subtitle: 'Admitted when I was wrong' },
  { key: 'integrity', label: 'Integrity', subtitle: 'Did the right thing when no one was watching' },
  { key: 'kindness', label: 'Kindness', subtitle: 'Encouraged someone today' },
] as const;


export const FINANCE = {
  month: '',
  income: 0,
  expenses: 0,
  savings: 0,
  savingsProgress: 55,
  houseFundProgress: 35,
};

export const HEALTH_METRICS = [
  { key: 'sleep', label: 'Sleep', value: '7h 15m', icon: 'moon' as const },
  { key: 'exercise', label: 'Exercise', value: '45 min', icon: 'fitness' as const },
  { key: 'water', label: 'Water', value: '2.1 / 3L', icon: 'water' as const },
  { key: 'mood', label: 'Mood', value: 'Great', icon: 'happy' as const },
  { key: 'meals', label: 'Meals', value: '2 / 3', icon: 'restaurant' as const },
] as const;

export const LIFE_COMPASS = [
  { key: 'love_god', label: 'Love God', icon: 'heart' as const, color: '#FF453A' },
  { key: 'serve_people', label: 'Serve People', icon: 'people' as const, color: '#30D158' },
  { key: 'solve_problems', label: 'Solve Problems', icon: 'bulb' as const, color: '#FF9F0A' },
  { key: 'keep_learning', label: 'Keep Learning', icon: 'school' as const, color: '#0A84FF' },
  { key: 'build_things', label: 'Build Things', icon: 'hammer' as const, color: '#BF5AF2' },
  { key: 'finish_start', label: 'Finish What You Start', icon: 'checkmark-done' as const, color: '#30D158' },
] as const;

export const DOMAIN_AREAS = [
  { route: '/faith', icon: 'heart' as const, label: 'Faith', color: '#FF453A' },
  { route: '/mind', icon: 'bulb' as const, label: 'Mind', subtitle: 'Growth', color: '#0A84FF' },
  { route: '/career', icon: 'briefcase' as const, label: 'Career', color: '#FF9F0A' },
  { route: '/builder', icon: 'hammer' as const, label: 'Builder', subtitle: 'Projects', color: '#BF5AF2' },
  { route: '/character', icon: 'shield-checkmark' as const, label: 'Character', color: '#30D158' },
  { route: '/finance', icon: 'wallet' as const, label: 'Finance', color: '#30D158' },
  { route: '/health', icon: 'fitness' as const, label: 'Health', color: '#FF453A' },
  { route: '/weekly-review', icon: 'calendar' as const, label: 'Weekly Review', color: '#0A84FF' },
  { route: '/identity', icon: 'person' as const, label: 'Identity', color: '#98989D' },
  { route: '/life-compass', icon: 'compass' as const, label: 'Life Compass', color: '#FF9F0A' },
] as const;

export const EVENING_REFLECTION_QUESTIONS = [
  { key: 'honored_god', question: 'Did I honor God today?' },
  { key: 'made_life_easier', question: "Did I make someone's life easier?" },
  { key: 'problem_solved', question: 'What problem did I solve?' },
  { key: 'learned', question: 'What did I learn?' },
  { key: 'grateful', question: 'What am I grateful for?' },
  { key: 'improve_tomorrow', question: 'What can I improve tomorrow?' },
] as const;

export type ReflectionKey = (typeof EVENING_REFLECTION_QUESTIONS)[number]['key'];

export const DECISION_FILTER_QUESTIONS = [
  'Does this solve a real problem?',
  "Does it make someone's life easier?",
  'Does it align with my long-term goals?',
  'Is this the highest priority right now?',
  'Can this be simplified?',
];

export const REMINDERS = [
  'Success without character is failure.',
  'Talent without discipline fades.',
  'Knowledge without wisdom is dangerous.',
  'Faith should influence every area of life.',
  'People should experience Christ through the way I treat them.',
];

export const TRUST_STATEMENT =
  "I don't want people to admire me because I'm intelligent. I want people to trust me because I am honest, dependable, humble, excellent, and Christ-like.";

export const PRODUCTIVITY_RULES = [
  'There is always ONE primary project.',
  'Everything else goes into the backlog.',
  'Small progress every day beats burning out.',
  'Never pursue success at the expense of faith, health, family, church, band, or rest.',
];

export const DEFAULT_HABITS = [
  { title: 'Morning devotion', color: '#5856D6' },
  { title: 'Bible study', color: '#007AFF' },
  { title: 'Move my body', color: '#34C759' },
];

export const QUICK_ADD_ACTIONS = [
  { icon: 'add-circle' as const, label: 'Task', route: '/add-task' },
  { icon: 'file-tray-full' as const, label: 'Inbox', route: '/inbox' },
  { icon: 'repeat' as const, label: 'Habit', route: '/add-habit' },
  { icon: 'moon' as const, label: 'Journal', route: '/evening-reflection' },
  { icon: 'list' as const, label: 'Tasks', route: '/tasks' },
] as const;

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${USER_NAME}.`;
  if (hour < 17) return `Good afternoon, ${USER_NAME}.`;
  return `Good evening, ${USER_NAME}.`;
}

export function getDailyReminder(): string {
  const day = Math.floor(Date.now() / 86_400_000);
  return REMINDERS[day % REMINDERS.length];
}

export function getDailyVerse() {
  const day = Math.floor(Date.now() / 86_400_000);
  return DAILY_VERSES[day % DAILY_VERSES.length];
}

export function isReflectionTime(): boolean {
  return new Date().getHours() >= 17;
}
