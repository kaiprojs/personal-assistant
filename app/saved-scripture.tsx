import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuoteCard } from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDisplayDate } from '@/lib/dates';
import { removeSavedScripture, getThemeLabel } from '@/lib/scripture';
import type { SavedScripture } from '@/lib/life-profile';

function groupByDate(items: SavedScripture[]): [string, SavedScripture[]][] {
  const map = new Map<string, SavedScripture[]>();
  for (const item of items) {
    const list = map.get(item.savedDate) ?? [];
    list.push(item);
    map.set(item.savedDate, list);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export default function SavedScriptureScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const insets = useSafeAreaInsets();
  const faith = lifeProfile.faith;
  const saved = faith.savedScripture ?? [];
  const grouped = groupByDate(saved);

  const remove = (id: string) => {
    updateLifeProfile('faith', removeSavedScripture(faith, id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.accent, fontSize: 17 }}>Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Scripture</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {saved.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Verses you save from Today will appear here — tap the bookmark on the
            daily verse when one resonates.
          </Text>
        ) : (
          grouped.map(([date, verses]) => (
            <View key={date} style={styles.section}>
              <Text style={[styles.sectionDate, { color: colors.textMuted }]}>
                {formatDisplayDate(date)}
              </Text>
              {verses.map((item) => (
                <Pressable key={item.id} onLongPress={() => remove(item.id)}>
                  <QuoteCard
                    text={item.text}
                    reference={`${item.reference} · ${getThemeLabel(item.theme)}`}
                    icon="bookmark"
                    iconColor={colors.green}
                  />
                  <Text style={[styles.hint, { color: colors.textMuted }]}>
                    long-press to remove
                  </Text>
                </Pressable>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 17, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15, lineHeight: 22 },
  section: { marginBottom: 8 },
  sectionDate: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hint: { fontSize: 11, marginTop: -8, marginBottom: 12, marginLeft: 4 },
});
