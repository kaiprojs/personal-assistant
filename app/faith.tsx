import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditValueModal } from '@/components/ui/EditValueModal';
import {
  Card,
  CheckRow,
  MenuRow,
  ProgressBar,
  QuoteCard,
  ScreenHeader,
  ScreenScroll,
  SectionLabel,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDailyChecklist } from '@/hooks/useDailyChecklist';
import {
  formatReadingLabel,
  getMemoryVerse,
  getReadingProgress,
  type FaithProfile,
} from '@/lib/life-profile';
import { DAILY_VERSES, FAITH_CHECKLIST } from '@/lib/personal-os';

export default function FaithScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const faith = lifeProfile.faith;
  const keys = FAITH_CHECKLIST.map((i) => i.key);
  const { checked, toggle } = useDailyChecklist('faith', keys);
  const [editReading, setEditReading] = useState(false);
  const memoryVerse = getMemoryVerse(faith);
  const readingProgress = getReadingProgress(faith);

  const saveFaith = (next: FaithProfile) => updateLifeProfile('faith', next);

  const advanceVerse = () => {
    const { currentVerse, totalVerses } = faith.reading;
    if (currentVerse < totalVerses) {
      saveFaith({
        ...faith,
        reading: { ...faith.reading, currentVerse: currentVerse + 1 },
      });
    }
  };

  const nextMemoryVerse = () => {
    saveFaith({
      ...faith,
      memoryVerseIndex: (faith.memoryVerseIndex + 1) % DAILY_VERSES.length,
    });
  };

  const toggleActivity = (id: string) => {
    saveFaith({
      ...faith,
      activities: faith.activities.map((a) =>
        a.id === id ? { ...a, done: !a.done } : a,
      ),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Faith" icon="heart" />
      <ScreenScroll>
        <Card style={{ paddingVertical: 4 }}>
          {FAITH_CHECKLIST.map((item, i) => (
            <CheckRow
              key={item.key}
              label={item.label}
              subtitle={'subtitle' in item ? item.subtitle : undefined}
              checked={checked[item.key] ?? false}
              onToggle={() => toggle(item.key)}
              showDivider={i < FAITH_CHECKLIST.length - 1}
            />
          ))}
        </Card>

        <Card>
          <Pressable onPress={() => setEditReading(true)}>
            <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
              Bible Reading · {formatReadingLabel(faith)}
            </Text>
            <ProgressBar progress={readingProgress} color={colors.green} />
            <Text style={[styles.progressHint, { color: colors.textMuted }]}>
              {faith.reading.currentVerse} / {faith.reading.totalVerses} verses
              · tap to edit plan
            </Text>
          </Pressable>
          <View style={styles.btnRow}>
            <Pressable
              onPress={advanceVerse}
              style={[styles.actionBtn, { backgroundColor: colors.greenMuted }]}>
              <Text style={[styles.actionText, { color: colors.green }]}>
                +1 verse read
              </Text>
            </Pressable>
            {faith.reading.currentVerse >= faith.reading.totalVerses && (
              <Pressable
                onPress={() =>
                  saveFaith({
                    ...faith,
                    reading: {
                      ...faith.reading,
                      chapter: faith.reading.chapter + 1,
                      currentVerse: 0,
                    },
                  })
                }
                style={[styles.actionBtn, { backgroundColor: colors.blueMuted }]}>
                <Text style={[styles.actionText, { color: colors.blue }]}>
                  Next chapter
                </Text>
              </Pressable>
            )}
          </View>
        </Card>

        <Pressable onPress={nextMemoryVerse}>
          <QuoteCard
            text={memoryVerse.text}
            reference={`${memoryVerse.reference} · tap for next`}
            icon="star"
            iconColor={colors.orange}
          />
        </Pressable>

        <SectionLabel title="Activities" />
        <Card style={{ paddingVertical: 4 }}>
          {faith.activities.map((item, i) => (
            <CheckRow
              key={item.id}
              label={item.title}
              subtitle={item.subtitle}
              checked={item.done}
              onToggle={() => toggleActivity(item.id)}
              showDivider={i < faith.activities.length - 1}
            />
          ))}
        </Card>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <MenuRow
            icon="moon"
            label="Evening reflection"
            subtitle="Did I honor God today?"
            onPress={() => router.push('/evening-reflection')}
            last
          />
        </Card>
      </ScreenScroll>

        <EditValueModal
        visible={editReading}
        title="Bible reading plan"
        value={`${faith.reading.book} ${faith.reading.chapter}|${faith.reading.totalVerses}`}
        onClose={() => setEditReading(false)}
        onSave={(raw) => {
          const [bookPart, totalStr] = raw.split('|');
          const match = bookPart.trim().match(/^(.+?)\s+(\d+)$/);
          if (match) {
            saveFaith({
              ...faith,
              reading: {
                book: match[1],
                chapter: Number(match[2]),
                currentVerse: Math.min(
                  faith.reading.currentVerse,
                  Number(totalStr) || faith.reading.totalVerses,
                ),
                totalVerses: Number(totalStr) || faith.reading.totalVerses,
              },
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  progressHint: { fontSize: 12, marginTop: 6 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionText: { fontSize: 13, fontWeight: '600' },
});
