import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LoadingView, TaskRow } from '@/components/TaskUI';
import {
  Card,
  CheckRow,
  ProgressBar,
  ProgressRing,
  ScreenScroll,
  SectionLabel,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDailyChecklist } from '@/hooks/useDailyChecklist';
import { BUILDER_PROGRESS, BUILDER_TOOLS } from '@/lib/personal-os';

export default function ProjectsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { loading, primaryFocus, tasks, setPrimaryFocusProgress } = useAppData();
  const { checked, toggle } = useDailyChecklist(
    'builder',
    BUILDER_PROGRESS.map((p) => p.key),
  );

  if (loading) return <LoadingView />;

  const backlog = tasks.filter(
    (t) => t.status === 'pending' && !t.inbox && t.title !== primaryFocus?.title,
  );

  return (
    <ScreenScroll>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Projects</Text>
      </View>

      <SectionLabel title="Current Project" />
      <Card onPress={() => router.push('/primary-focus')}>
        <View style={styles.focusRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.projectTitle, { color: colors.text }]}>
              {primaryFocus?.title ?? 'Set primary project'}
            </Text>
            <ProgressBar progress={primaryFocus?.progress ?? 0} />
          </View>
          <ProgressRing progress={primaryFocus?.progress ?? 0} size={48} />
        </View>
        <Pressable
          onPress={() =>
            setPrimaryFocusProgress(Math.min(100, (primaryFocus?.progress ?? 0) + 5))
          }
          style={[styles.progressBtn, { backgroundColor: colors.greenMuted }]}>
          <Text style={[styles.progressBtnText, { color: colors.green }]}>
            +5% progress
          </Text>
        </Pressable>
      </Card>

      <SectionLabel title="Project Tools" />
      <View style={styles.toolsRow}>
        {BUILDER_TOOLS.map((tool) => (
          <View key={tool.label} style={[styles.tool, { backgroundColor: colors.card }]}>
            <Ionicons name={tool.icon} size={22} color={colors.accent} />
            <Text style={[styles.toolLabel, { color: colors.textMuted }]}>
              {tool.label}
            </Text>
          </View>
        ))}
      </View>

      <SectionLabel title="Recent Progress" />
      <Card style={{ paddingVertical: 4 }}>
        {BUILDER_PROGRESS.map((item, i) => (
          <CheckRow
            key={item.key}
            label={item.label}
            checked={checked[item.key] ?? item.done}
            onToggle={() => toggle(item.key)}
            showDivider={i < BUILDER_PROGRESS.length - 1}
          />
        ))}
      </Card>

      <SectionLabel title={`Backlog · ${backlog.length}`} />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {backlog.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Backlog is clear
          </Text>
        ) : (
          backlog.slice(0, 8).map((task) => (
            <TaskRow key={task.id} task={task} enableSwipe={false} />
          ))
        )}
      </Card>
      {backlog.length > 8 && (
        <Pressable onPress={() => router.push('/tasks')} style={styles.link}>
          <Text style={{ color: colors.accent }}>View all tasks</Text>
        </Pressable>
      )}

      <Pressable onPress={() => router.push('/builder')} style={styles.link}>
        <Text style={{ color: colors.accent }}>Open Builder view →</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 34, fontWeight: '700' },
  focusRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  projectTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  progressBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  progressBtnText: { fontSize: 13, fontWeight: '600' },
  toolsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  tool: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 6,
  },
  toolLabel: { fontSize: 10, fontWeight: '600' },
  empty: { padding: 20, textAlign: 'center' },
  link: { alignItems: 'center', paddingVertical: 12 },
});
