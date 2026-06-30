import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getDailyReminder, getGreeting, isReflectionTime, MISSION } from '@/lib/personal-os';

export function TodayHeader() {
  const { colors } = useTheme();
  const { hasReflectionToday } = useAppData();
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.greeting, { color: colors.text }]}>
        {getGreeting()}
      </Text>
      <Text style={[styles.mission, { color: colors.textMuted }]} numberOfLines={3}>
        {MISSION}
      </Text>
      <Text style={[styles.reminder, { color: colors.today }]}>
        {getDailyReminder()}
      </Text>
      {isReflectionTime() && !hasReflectionToday && (
        <Pressable
          onPress={() => router.push('/evening-reflection')}
          style={[styles.reflectBanner, { backgroundColor: colors.eveningMuted }]}>
          <Ionicons name="moon" size={20} color={colors.evening} />
          <Text style={[styles.reflectText, { color: colors.evening }]}>
            Evening reflection — take 5 minutes
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.evening} />
        </Pressable>
      )}
    </View>
  );
}

export function PrimaryFocusCard() {
  const { colors } = useTheme();
  const { primaryFocus } = useAppData();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/primary-focus')}
      style={[styles.focusCard, { backgroundColor: colors.accentMuted }]}>
      <View style={styles.focusHeader}>
        <Ionicons name="flag" size={18} color={colors.accent} />
        <Text style={[styles.focusLabel, { color: colors.accent }]}>
          PRIMARY PROJECT
        </Text>
      </View>
      {primaryFocus ? (
        <>
          <Text style={[styles.focusTitle, { color: colors.text }]}>
            {primaryFocus.title}
          </Text>
          {primaryFocus.description ? (
            <Text
              style={[styles.focusDesc, { color: colors.textMuted }]}
              numberOfLines={2}>
              {primaryFocus.description}
            </Text>
          ) : null}
        </>
      ) : (
        <Text style={[styles.focusEmpty, { color: colors.textMuted }]}>
          Tap to set your one primary focus
        </Text>
      )}
      <Text style={[styles.focusHint, { color: colors.accent }]}>
        One project. Everything else is backlog.
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingBottom: 8 },
  greeting: { fontSize: 28, fontWeight: '700' },
  mission: { fontSize: 14, lineHeight: 20, marginTop: 8, fontStyle: 'italic' },
  reminder: { fontSize: 13, fontWeight: '600', marginTop: 10 },
  reflectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  reflectText: { flex: 1, fontSize: 14, fontWeight: '600' },
  focusCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  focusLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  focusTitle: { fontSize: 18, fontWeight: '700' },
  focusDesc: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  focusEmpty: { fontSize: 16 },
  focusHint: { fontSize: 12, marginTop: 10, fontWeight: '500' },
});
