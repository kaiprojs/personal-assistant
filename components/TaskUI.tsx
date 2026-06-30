import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDisplayDate } from '@/lib/dates';
import type { Task } from '@/lib/types';

interface TaskRowProps {
  task: Task;
  onPress?: () => void;
  showProject?: boolean;
  enableSwipe?: boolean;
}

const PRIORITY_COLORS = ['', '#FF3B30', '#FF9500', '#007AFF', '#8E8E93'];

export function TaskRow({
  task,
  onPress,
  enableSwipe = true,
}: TaskRowProps) {
  const { colors } = useTheme();
  const { completeTask, snoozeTask, deleteTask } = useAppData();
  const router = useRouter();
  const isDone = task.status === 'completed';

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isDone) return;
    await completeTask(task.id);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push({ pathname: '/add-task', params: { id: task.id } });
  };

  const content = (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Pressable onPress={handleToggle} hitSlop={8} style={styles.checkboxHit}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isDone ? colors.checkboxDone : colors.checkbox,
              backgroundColor: isDone ? colors.checkboxDone : 'transparent',
            },
          ]}>
          {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </Pressable>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            isDone && styles.titleDone,
          ]}
          numberOfLines={2}>
          {task.title}
        </Text>
        {(task.due_date || task.due_time || task.priority > 0) && (
          <View style={styles.meta}>
            {task.priority > 0 && (
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: PRIORITY_COLORS[task.priority] },
                ]}
              />
            )}
            {task.due_date && (
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {formatDisplayDate(task.due_date)}
                {task.due_time ? ` · ${task.due_time}` : ''}
              </Text>
            )}
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );

  if (!enableSwipe || isDone) return content;

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            onPress={() => snoozeTask(task.id, 1)}>
            <Ionicons name="moon" size={20} color="#fff" />
            <Text style={styles.actionText}>Snooze</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.danger }]}
            onPress={() => deleteTask(task.id)}>
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      )}>
      {content}
    </Swipeable>
  );
}

export function SectionHeader({ title, count }: { title: string; count?: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.sectionHeader }]}>
        {title}
        {count !== undefined ? ` (${count})` : ''}
      </Text>
    </View>
  );
}

export function EmptyState({
  title,
  subtitle,
  icon = 'checkbox-outline',
}: {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export function LoadingView() {
  const { colors } = useTheme();
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

export function FAB({ onPress }: { onPress?: () => void }) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Pressable
      style={[styles.fab, { backgroundColor: colors.fab }]}
      onPress={onPress ?? (() => router.push('/add-task'))}>
      <Ionicons name="add" size={28} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkboxHit: { padding: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: '500' },
  titleDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  actions: { flexDirection: 'row' },
  actionBtn: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
