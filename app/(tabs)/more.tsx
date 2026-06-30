import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemePreference } from '@/lib/types';
import { requestNotificationPermissions } from '@/lib/notifications';
import { DOMAIN_AREAS } from '@/lib/personal-os';
import { Card, DomainGrid, MenuRow, SectionLabel } from '@/components/ui/OSUI';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function MoreScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { exportBackup, importBackup } = useAppData();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleExport = async () => {
    try {
      await exportBackup();
    } catch {
      Alert.alert('Export failed', 'Could not create backup file.');
    }
  };

  const handleImport = async () => {
    Alert.alert('Import backup', 'This will replace all current data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Import',
        style: 'destructive',
        onPress: async () => {
          try {
            const ok = await importBackup();
            if (ok) Alert.alert('Success', 'Backup restored.');
          } catch {
            Alert.alert('Import failed', 'Invalid or corrupted backup file.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.text }]}>More</Text>
      </View>

      <SectionLabel title="Life Areas" />
      <DomainGrid
        areas={DOMAIN_AREAS}
        onPress={(route) => router.push(route as never)}
      />

      <SectionLabel title="Organize" />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <MenuRow
          icon="file-tray-full"
          label="Inbox"
          subtitle="Quick capture"
          onPress={() => router.push('/inbox')}
        />
        <MenuRow
          icon="list"
          label="Tasks"
          subtitle="All, today, upcoming, done"
          onPress={() => router.push('/tasks')}
        />
        <MenuRow
          icon="repeat"
          label="Habits"
          subtitle="Daily check-ins"
          onPress={() => router.push('/habits')}
          last
        />
      </Card>

      <SectionLabel title="Appearance" />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {THEME_OPTIONS.map((opt, i) => (
          <Pressable
            key={opt.value}
            onPress={() => setPreference(opt.value)}
            style={[
              styles.themeRow,
              i < THEME_OPTIONS.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}>
            <Text style={[styles.themeLabel, { color: colors.text }]}>{opt.label}</Text>
            {preference === opt.value && (
              <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text>
            )}
          </Pressable>
        ))}
      </Card>

      <SectionLabel title="Notifications" />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <MenuRow
          icon="notifications"
          label="Enable reminders"
          subtitle="Local alerts for due tasks"
          onPress={async () => {
            const granted = await requestNotificationPermissions();
            Alert.alert(
              granted ? 'Notifications enabled' : 'Notifications disabled',
              granted
                ? 'You will receive reminders for tasks with due dates.'
                : 'Enable notifications in Settings to get task reminders.',
            );
          }}
          last
        />
      </Card>

      <SectionLabel title="Data" />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <MenuRow icon="cloud-upload" label="Export backup" onPress={handleExport} />
        <MenuRow
          icon="cloud-download"
          label="Import backup"
          onPress={handleImport}
          last
        />
      </Card>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        Personal OS · Local-first · Built for Kai
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 34, fontWeight: '700' },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  themeLabel: { fontSize: 16 },
  footer: { textAlign: 'center', fontSize: 13, marginTop: 32, paddingHorizontal: 24 },
});
