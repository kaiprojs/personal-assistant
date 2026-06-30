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
import { FAITH_CHECKLIST } from '@/lib/personal-os';
import { SCRIPTURE_VERSES } from '@/lib/scripture-verses';
import {
  formatVerseSubtitle,
  getSavedScriptureForDate,
  getThemeLabel,
  isScriptureSaved,
  saveScripture,
} from '@/lib/scripture';
import { toDateString } from '@/lib/dates';

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
  const todaySaved = getSavedScriptureForDate(faith);
  const savedCount = faith.savedScripture?.length ?? 0;

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
      memoryVerseIndex: (faith.memoryVerseIndex + 1) % SCRIPTURE_VERSES.length,
    });
  };

  const saveMemoryVerse = () => {
    if (isScriptureSaved(faith, memoryVerse.reference)) return;
    saveFaith(saveScripture(faith, memoryVerse));
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
            reference={`${memoryVerse.reference} · ${formatVerseSubtitle(memoryVerse)} · tap for next`}
            icon="star"
            iconColor={colors.orange}
          />
        </Pressable>
        <Pressable
          onPress={saveMemoryVerse}
          style={[styles.saveMemoryBtn, { backgroundColor: colors.greenMuted }]}>
          <Ionicons
            name={
              isScriptureSaved(faith, memoryVerse.reference)
                ? 'bookmark'
                : 'bookmark-outline'
            }
            size={16}
            color={colors.green}
          />
          <Text style={[styles.saveMemoryText, { color: colors.green }]}>
            {isScriptureSaved(faith, memoryVerse.reference)
              ? 'Saved to Scripture'
              : 'Save this verse'}
          </Text>
        </Pressable>

        <SectionLabel
          title="Scripture"
          action={savedCount > 0 ? 'See all' : undefined}
          onAction={savedCount > 0 ? () => router.push('/saved-scripture') : undefined}
        />
        {todaySaved.length === 0 ? (
          <Card>
            <Text style={[styles.emptyScripture, { color: colors.textMuted }]}>
              Save verses from Today or tap Save above when one resonates with you.
            </Text>
          </Card>
        ) : (
          todaySaved.map((item) => (
            <QuoteCard
              key={item.id}
              text={item.text}
              reference={`${item.reference} · ${getThemeLabel(item.theme)}`}
              icon="bookmark"
              iconColor={colors.green}
            />
          ))
        )}

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
  saveMemoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: -4,
    marginBottom: 8,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveMemoryText: { fontSize: 13, fontWeight: '600' },
  emptyScripture: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
