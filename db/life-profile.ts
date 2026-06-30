import type { SQLiteDatabase } from 'expo-sqlite';

import { getPersistentState, setPersistentState } from '@/db/domain-state';
import {
  DEFAULT_PROFILES,
  type LifeProfileKey,
  type LifeProfiles,
} from '@/lib/life-profile';

function profileKey(key: LifeProfileKey): string {
  return `profile_${key}`;
}

export async function loadLifeProfiles(db: SQLiteDatabase): Promise<LifeProfiles> {
  const profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES)) as LifeProfiles;

  for (const key of Object.keys(DEFAULT_PROFILES) as LifeProfileKey[]) {
    const stored = await getPersistentState<unknown>(db, profileKey(key));
    if (!stored) continue;

    if (typeof stored === 'object' && stored !== null && !Array.isArray(stored)) {
      (profiles as Record<LifeProfileKey, LifeProfiles[LifeProfileKey]>)[key] = {
        ...(profiles[key] as object),
        ...(stored as object),
      } as LifeProfiles[LifeProfileKey];
    }
  }

  return profiles;
}

export async function saveLifeProfile<K extends LifeProfileKey>(
  db: SQLiteDatabase,
  key: K,
  value: LifeProfiles[K],
): Promise<void> {
  await setPersistentState(db, profileKey(key), value);
}

export async function getAllDomainState(
  db: SQLiteDatabase,
): Promise<{ key: string; value: string; updated_at: string }[]> {
  return db.getAllAsync('SELECT key, value, updated_at FROM domain_state');
}

export async function replaceAllDomainState(
  db: SQLiteDatabase,
  rows: { key: string; value: string; updated_at: string }[],
): Promise<void> {
  await db.execAsync('DELETE FROM domain_state');
  for (const row of rows) {
    await db.runAsync(
      'INSERT INTO domain_state (key, value, updated_at) VALUES (?, ?, ?)',
      row.key,
      row.value,
      row.updated_at,
    );
  }
}
