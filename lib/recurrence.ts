import { addDays, toDateString } from './dates';

export type RecurrenceRule = 'daily' | 'weekly' | 'monthly';

export const RECURRENCE_OPTIONS: { label: string; value: RecurrenceRule }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export function nextRecurrenceDate(
  current: string,
  rule: RecurrenceRule,
): string {
  const date = new Date(current + 'T12:00:00');
  if (rule === 'daily') {
    return toDateString(addDays(date, 1));
  }
  if (rule === 'weekly') {
    return toDateString(addDays(date, 7));
  }
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return toDateString(next);
}
