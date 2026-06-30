import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { isSunday } from '@/lib/dates';

export function WeekPlanBanner() {
  const { colors } = useTheme();
  const router = useRouter();

  if (!isSunday()) return null;

  return (
    <Pressable
      onPress={() => router.push('/weekly-review')}
      style={[styles.banner, { backgroundColor: colors.banner }]}>
      <Ionicons name="calendar" size={22} color={colors.today} />
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.bannerText }]}>
          Plan your week
        </Text>
        <Text style={[styles.subtitle, { color: colors.bannerText }]}>
          Take 5 minutes to review and schedule
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.bannerText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  text: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600' },
  subtitle: { fontSize: 13, marginTop: 2, opacity: 0.85 },
});
