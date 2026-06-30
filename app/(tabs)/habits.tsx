import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { HabitRow } from '@/components/HabitUI';
import { EmptyState, LoadingView } from '@/components/TaskUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatLongDate } from '@/lib/dates';

export default function HabitsScreen() {
  const { colors } = useTheme();
  const { loading, habits } = useAppData();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (loading) return <LoadingView />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}>
        <Text style={[styles.date, { color: colors.textMuted }]}>
          {formatLongDate()}
        </Text>

        {habits.length === 0 ? (
          <EmptyState
            title="No habits yet"
            subtitle="Build routines that stick — one tap a day"
            icon="repeat-outline"
          />
        ) : (
          <View style={[styles.list, { backgroundColor: colors.card }]}>
            {habits.map((habit) => (
              <HabitRow key={habit.id} habit={habit} />
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        style={[styles.addHabit, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/add-habit')}>
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.addHabitText}>Add habit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 8 },
  date: { fontSize: 15, paddingHorizontal: 20, marginBottom: 12 },
  list: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  addHabit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addHabitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
