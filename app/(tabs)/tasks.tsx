import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  EmptyState,
  FAB,
  LoadingView,
  TaskRow,
} from '@/components/TaskUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { Task, TaskFilter } from '@/lib/types';

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'done', label: 'Done' },
];

export default function TasksScreen() {
  const { colors } = useTheme();
  const { loading, getFilteredTasks } = useAppData();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [filtered, setFiltered] = useState<Task[]>([]);

  const load = useCallback(async () => {
    const tasks = await getFilteredTasks(filter);
    setFiltered(tasks);
  }, [filter, getFilteredTasks]);

  useEffect(() => {
    if (!loading) load();
  }, [loading, load]);

  if (loading) return <LoadingView />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  filter === f.key ? colors.accent : colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                { color: filter === f.key ? '#fff' : colors.text },
              ]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 88 },
        ]}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No tasks here"
            subtitle="Try a different filter or add a new task"
          />
        ) : (
          <View style={[styles.list, { backgroundColor: colors.card }]}>
            {filtered.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </View>
        )}
      </ScrollView>
      <FAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chipsScroll: { maxHeight: 52, flexGrow: 0 },
  chips: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  scroll: { paddingTop: 4 },
  list: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
});
