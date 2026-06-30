import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LoadingView } from '@/components/TaskUI';
import { Card, ScreenScroll, SectionLabel } from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { EveningReflection } from '@/lib/types';
import { EVENING_REFLECTION_QUESTIONS, isReflectionTime } from '@/lib/personal-os';

export default function JournalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { loading, getAllEveningReflections, hasReflectionToday } = useAppData();
  const [entries, setEntries] = useState<EveningReflection[]>([]);

  const loadEntries = useCallback(() => {
    getAllEveningReflections().then(setEntries);
  }, [getAllEveningReflections]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) loadEntries();
    }, [loading, loadEntries]),
  );

  if (loading) return <LoadingView />;

  const preview = (entry: EveningReflection) => {
    for (const q of EVENING_REFLECTION_QUESTIONS) {
      const val = entry[q.key];
      if (val?.trim()) return val;
    }
    return 'Reflection saved';
  };

  return (
    <ScreenScroll>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Journal</Text>
      </View>

      <Pressable
        onPress={() => router.push('/evening-reflection')}
        style={[styles.todayCard, { backgroundColor: colors.eveningMuted }]}>
        <Text style={[styles.todayTitle, { color: colors.evening }]}>
          {hasReflectionToday ? "Today's reflection ✓" : 'Write tonight\'s reflection'}
        </Text>
        <Text style={[styles.todaySub, { color: colors.textMuted }]}>
          {isReflectionTime()
            ? '6 questions · faith, service, growth'
            : 'Best after 5pm — open anytime'}
        </Text>
      </Pressable>

      <SectionLabel title="Past entries" />
      {entries.length === 0 ? (
        <Card>
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            No journal entries yet. Start with tonight's reflection.
          </Text>
        </Card>
      ) : (
        entries.map((entry) => (
          <Card
            key={entry.log_date}
            onPress={() =>
              router.push({
                pathname: '/evening-reflection',
                params: { date: entry.log_date },
              })
            }>
            <Text style={[styles.entryDate, { color: colors.textMuted }]}>
              {entry.log_date}
            </Text>
            <Text style={[styles.entryPreview, { color: colors.text }]} numberOfLines={3}>
              {preview(entry)}
            </Text>
          </Card>
        ))
      )}

      <Pressable onPress={() => router.push('/weekly-review')} style={styles.link}>
        <Text style={{ color: colors.accent }}>Weekly review →</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 34, fontWeight: '700' },
  todayCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 14,
  },
  todayTitle: { fontSize: 18, fontWeight: '700' },
  todaySub: { fontSize: 14, marginTop: 4 },
  empty: { fontSize: 15, lineHeight: 22 },
  entryDate: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  entryPreview: { fontSize: 15, lineHeight: 22 },
  link: { alignItems: 'center', paddingVertical: 16 },
});
