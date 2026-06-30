import { generateId, getDayOfYear, nowIso, toDateString } from '@/lib/dates';
import type { FaithProfile, SavedScripture } from '@/lib/life-profile';
import {
  SCRIPTURE_VERSES,
  SCRIPTURE_THEME_LABELS,
  type ScriptureVerse,
} from '@/lib/scripture-verses';

export type { ScriptureVerse };
export { SCRIPTURE_VERSES, SCRIPTURE_THEME_LABELS };

/** @deprecated Use SCRIPTURE_VERSES */
export const DAILY_VERSES = SCRIPTURE_VERSES;

export function getDailyVerse(date: Date = new Date()): ScriptureVerse {
  const index = getDayOfYear(date) % SCRIPTURE_VERSES.length;
  return SCRIPTURE_VERSES[index]!;
}

export function getThemeLabel(theme: string): string {
  return SCRIPTURE_THEME_LABELS[theme as keyof typeof SCRIPTURE_THEME_LABELS] ?? theme;
}

export function formatVerseSubtitle(verse: ScriptureVerse): string {
  return `${getThemeLabel(verse.theme)} · ${verse.group}`;
}

export function isScriptureSaved(
  profile: FaithProfile,
  reference: string,
  savedDate: string = toDateString(),
): boolean {
  return (profile.savedScripture ?? []).some(
    (v) => v.reference === reference && v.savedDate === savedDate,
  );
}

export function saveScripture(
  profile: FaithProfile,
  verse: ScriptureVerse,
  savedDate: string = toDateString(),
): FaithProfile {
  if (isScriptureSaved(profile, verse.reference, savedDate)) {
    return profile;
  }
  const entry: SavedScripture = {
    id: generateId(),
    scriptureId: verse.id,
    reference: verse.reference,
    text: verse.text,
    theme: verse.theme,
    group: verse.group,
    savedDate,
    savedAt: nowIso(),
  };
  return {
    ...profile,
    savedScripture: [entry, ...(profile.savedScripture ?? [])],
  };
}

export function removeSavedScripture(
  profile: FaithProfile,
  id: string,
): FaithProfile {
  return {
    ...profile,
    savedScripture: (profile.savedScripture ?? []).filter((v) => v.id !== id),
  };
}

export function getSavedScriptureForDate(
  profile: FaithProfile,
  date: string = toDateString(),
): SavedScripture[] {
  return (profile.savedScripture ?? []).filter((v) => v.savedDate === date);
}
