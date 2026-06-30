import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LoadingView, TaskRow } from '@/components/TaskUI';
import { Card, ScreenScroll, SectionLabel } from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  addDays,
  formatHeaderDate,
  getWeekDates,
  toDateString,
} from '@/lib/dates';
import type { Task } from '@/lib/types';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { loading, getTasksForDate } = useAppData();
  const [anchor, setAnchor] = useState(new Date());
  const [selected, setSelected] = useState(toDateString());
  const [dayTasks, setDayTasks] = useState<Task[]>([]);

  const weekDates = getWeekDates(anchor);
  const today = toDateString();

  const loadDay = useCallback(
    async (dateStr: string) => {
      setSelected(dateStr);
      const tasks = await getTasksForDate(dateStr);
      setDayTasks(tasks);
    },
    [getTasksForDate],
  );

  useEffect(() => {
    if (!loading) loadDay(selected);
  }, [loading, selected, loadDay]);

  if (loading) return <LoadingView />;

  return (
    <ScreenScroll>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Calendar</Text>
      </View>

      <View style={styles.weekStrip}>
        {weekDates.map((date) => {
          const ds = toDateString(date);
          const active = ds === selected;
          const isToday = ds === today;
          return (
            <Pressable
              key={ds}
              onPress={() => loadDay(ds)}
              style={[
                styles.dayChip,
                active && { backgroundColor: colors.accent },
                !active && { backgroundColor: colors.card },
              ]}>
              <Text
                style={[
                  styles.dayName,
                  { color: active ? '#fff' : colors.textMuted },
                ]}>
                {formatHeaderDate(date).split(' ')[0]}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  { color: active ? '#fff' : colors.text },
                  isToday && !active && { color: colors.accent },
                ]}>
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionLabel title={selected === today ? 'Today' : selected} />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {dayTasks.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            No tasks scheduled
          </Text>
        ) : (
          dayTasks.map((task) => (
            <TaskRow key={task.id} task={task} enableSwipe={false} />
          ))
        )}
      </Card>

      <Pressable
        onPress={() => setAnchor(addDays(anchor, -7))}
        style={styles.navRow}>
        <Text style={{ color: colors.accent }}>← Previous week</Text>
      </Pressable>
      <Pressable
        onPress={() => setAnchor(addDays(anchor, 7))}
        style={styles.navRow}>
        <Text style={{ color: colors.accent }}>Next week →</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 34, fontWeight: '700' },
  weekStrip: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: 8,
  },
  dayChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  dayName: { fontSize: 11, fontWeight: '600' },
  dayNum: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  empty: { padding: 20, textAlign: 'center', fontSize: 15 },
  navRow: { alignItems: 'center', paddingVertical: 12 },
});
