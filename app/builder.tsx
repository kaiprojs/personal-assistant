import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Card,
  CheckRow,
  ProgressBar,
  ScreenHeader,
  ScreenScroll,
  SectionLabel,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDailyChecklist } from '@/hooks/useDailyChecklist';
import { BUILDER_PROGRESS, BUILDER_TOOLS } from '@/lib/personal-os';
import { Ionicons } from '@expo/vector-icons';

export default function BuilderScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { primaryFocus } = useAppData();
  const { checked, toggle } = useDailyChecklist(
    'builder',
    BUILDER_PROGRESS.map((p) => p.key),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Builder" icon="hammer" />
      <ScreenScroll>
        <Card onPress={() => router.push('/primary-focus')}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Current Project</Text>
          <Text style={[styles.projectTitle, { color: colors.text }]}>
            {primaryFocus?.title ?? 'Personal Assistant App'}
          </Text>
          <ProgressBar progress={primaryFocus?.progress ?? 75} />
        </Card>

        <SectionLabel title="Project Tools" />
        <View style={styles.toolsRow}>
          {BUILDER_TOOLS.map((tool) => (
            <View key={tool.label} style={[styles.tool, { backgroundColor: colors.card }]}>
              <Ionicons name={tool.icon} size={24} color={colors.accent} />
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

        <Pressable onPress={() => router.push('/projects')} style={styles.link}>
          <Text style={{ color: colors.accent }}>View Projects tab →</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  projectTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  toolsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  tool: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  toolLabel: { fontSize: 11, fontWeight: '600' },
  link: { alignItems: 'center', paddingVertical: 16 },
});
