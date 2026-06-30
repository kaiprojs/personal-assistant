import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditValueModal } from '@/components/ui/EditValueModal';
import {
  Card,
  MenuRow,
  ProgressBar,
  ScreenHeader,
  ScreenScroll,
  SectionLabel,
  TagPill,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { MindProfile } from '@/lib/life-profile';

export default function MindScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const mind = lifeProfile.mind;
  const [editBook, setEditBook] = useState(false);
  const [editProgress, setEditProgress] = useState<string | null>(null);

  const saveMind = (next: MindProfile) => updateLifeProfile('mind', next);

  const bumpProgress = (delta: number) => {
    const next = Math.max(0, Math.min(100, mind.currentBook.progress + delta));
    saveMind({
      ...mind,
      currentBook: { ...mind.currentBook, progress: next },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Mind" icon="bulb" />
      <ScreenScroll>
        <SectionLabel title="Currently Reading" />
        <Card>
          <Pressable onPress={() => setEditBook(true)}>
            <Text style={[styles.bookTitle, { color: colors.text }]}>
              {mind.currentBook.title}
            </Text>
            <Text style={[styles.bookAuthor, { color: colors.textMuted }]}>
              {mind.currentBook.author} · tap to edit
            </Text>
          </Pressable>
          <ProgressBar progress={mind.currentBook.progress} color={colors.blue} />
          <View style={styles.btnRow}>
            <Pressable
              onPress={() => bumpProgress(-5)}
              style={[styles.chip, { backgroundColor: colors.cardElevated }]}>
              <Text style={{ color: colors.text }}>−5%</Text>
            </Pressable>
            <Text style={[styles.progressText, { color: colors.textMuted }]}>
              {mind.currentBook.progress}%
            </Text>
            <Pressable
              onPress={() => bumpProgress(5)}
              style={[styles.chip, { backgroundColor: colors.greenMuted }]}>
              <Text style={{ color: colors.green }}>+5%</Text>
            </Pressable>
          </View>
        </Card>

        <SectionLabel title="Courses" />
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {mind.courses.map((course, i) => (
            <Pressable
              key={course.id}
              onPress={() => setEditProgress(course.id)}
              style={[
                styles.courseRow,
                i < mind.courses.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>
                  {course.title}
                </Text>
                <Text style={[styles.courseStatus, { color: colors.green }]}>
                  {course.status} · {course.progress}%
                </Text>
              </View>
            </Pressable>
          ))}
        </Card>

        <SectionLabel title="Skills" />
        <View style={styles.tags}>
          {mind.skills.map((skill) => (
            <TagPill key={skill} label={skill} outline />
          ))}
        </View>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <MenuRow
            icon="document-text"
            label="Notes & Ideas"
            subtitle={`${mind.notes.length} notes`}
            onPress={() => router.push('/mind-notes')}
          />
          <MenuRow
            icon="chatbubble-ellipses"
            label="Reflection"
            subtitle="What did I learn today?"
            onPress={() => router.push('/evening-reflection')}
            last
          />
        </Card>
      </ScreenScroll>

      <EditValueModal
        visible={editBook}
        title="Current book"
        value={`${mind.currentBook.title}|${mind.currentBook.author}`}
        onClose={() => setEditBook(false)}
        onSave={(raw) => {
          const [title, author] = raw.split('|');
          saveMind({
            ...mind,
            currentBook: {
              ...mind.currentBook,
              title: title?.trim() || mind.currentBook.title,
              author: author?.trim() || mind.currentBook.author,
            },
          });
        }}
      />

      {editProgress && (
        <EditValueModal
          visible
          title="Course progress %"
          value={
            String(
              mind.courses.find((c) => c.id === editProgress)?.progress ?? 0,
            )
          }
          mode="number"
          onClose={() => setEditProgress(null)}
          onSave={(raw) => {
            const progress = Math.max(0, Math.min(100, Number(raw) || 0));
            saveMind({
              ...mind,
              courses: mind.courses.map((c) =>
                c.id === editProgress ? { ...c, progress } : c,
              ),
            });
            setEditProgress(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookTitle: { fontSize: 20, fontWeight: '700' },
  bookAuthor: { fontSize: 14, marginTop: 4, marginBottom: 12 },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  progressText: { fontSize: 15, fontWeight: '600' },
  courseRow: { padding: 16 },
  courseTitle: { fontSize: 16, fontWeight: '600' },
  courseStatus: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
