import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { Habit } from '@/lib/types';

export function HabitRow({ habit }: { habit: Habit }) {
  const { colors } = useTheme();
  const { habitDoneToday, habitWeekCounts, toggleHabitToday } = useAppData();
  const done = habitDoneToday[habit.id];
  const weekCount = habitWeekCounts[habit.id] ?? 0;

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleHabitToday(habit.id);
  };

  return (
    <View style={[styles.row, { backgroundColor: colors.card }]}>
      <Pressable onPress={handleToggle} style={styles.left}>
        <View
          style={[
            styles.circle,
            {
              borderColor: habit.color,
              backgroundColor: done ? habit.color : 'transparent',
            },
          ]}>
          {done && <Ionicons name="checkmark" size={18} color="#fff" />}
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{habit.title}</Text>
      </Pressable>
      <WeekDots count={weekCount} color={habit.color} />
    </View>
  );
}

function WeekDots({ count, color }: { count: number; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.dots}>
      {Array.from({ length: 7 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i < count ? color : colors.border,
            },
          ]}
        />
      ))}
      <Text style={[styles.count, { color: colors.textMuted }]}>
        {count}/7
      </Text>
    </View>
  );
}

export function HabitChips() {
  const { habits, habitDoneToday, toggleHabitToday } = useAppData();
  const { colors } = useTheme();

  if (habits.length === 0) return null;

  return (
    <View style={styles.chips}>
      {habits.map((habit) => {
        const done = habitDoneToday[habit.id];
        return (
          <Pressable
            key={habit.id}
            onPress={() => toggleHabitToday(habit.id)}
            style={[
              styles.chip,
              {
                backgroundColor: done ? habit.color : colors.card,
                borderColor: habit.color,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                { color: done ? '#fff' : colors.text },
              ]}>
              {habit.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '500', flex: 1 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  count: { fontSize: 12, marginLeft: 4, minWidth: 28 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 14, fontWeight: '500' },
});
