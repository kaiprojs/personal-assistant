import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { getDailyState, setDailyState } from '@/db/domain-state';
import { toDateString } from '@/lib/dates';

export function useDailyChecklist(
  domain: string,
  itemKeys: readonly string[],
) {
  const db = useSQLiteContext();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  const keysKey = itemKeys.join(',');

  const load = useCallback(async () => {
    const state = await getDailyState<{ checked?: Record<string, boolean> }>(
      db,
      domain,
    );
    const initial: Record<string, boolean> = {};
    for (const key of itemKeys) {
      initial[key] = state?.checked?.[key] ?? false;
    }
    setChecked(initial);
    setReady(true);
  }, [db, domain, keysKey, itemKeys]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (key: string) => {
      const next = { ...checked, [key]: !checked[key] };
      setChecked(next);
      await setDailyState(db, domain, { checked: next, date: toDateString() });
    },
    [checked, db, domain],
  );

  return { checked, toggle, ready };
}

export function useDailyValues<T extends Record<string, string>>(
  domain: string,
  defaults: T,
) {
  const db = useSQLiteContext();
  const [values, setValues] = useState<T>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getDailyState<{ values?: T }>(db, domain).then((state) => {
      setValues({ ...defaults, ...(state?.values ?? {}) });
      setReady(true);
    });
  }, [db, domain, defaults]);

  const update = useCallback(
    async (key: keyof T, value: string) => {
      const next = { ...values, [key]: value };
      setValues(next);
      await setDailyState(db, domain, { values: next, date: toDateString() });
    },
    [db, domain, values],
  );

  return { values, update, ready };
}
