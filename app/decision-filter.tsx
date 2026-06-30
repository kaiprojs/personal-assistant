import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DECISION_FILTER_QUESTIONS } from '@/lib/personal-os';
import type { TaskInput } from '@/lib/types';

type Answer = 'yes' | 'unsure' | 'no' | null;

export default function DecisionFilterScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    notes?: string;
    priority?: string;
    inbox?: string;
    scheduled_date?: string;
    due_date?: string;
    due_time?: string;
    evening?: string;
    recurrence_rule?: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { createTask } = useAppData();
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Answer[]>(
    DECISION_FILTER_QUESTIONS.map(() => null),
  );
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const noCount = answers.filter((a) => a === 'no').length;

  const handleSave = async () => {
    if (!params.title?.trim() || saving) return;
    setSaving(true);

    const filterNotes = DECISION_FILTER_QUESTIONS.map(
      (q, i) => `${q}: ${answers[i]}`,
    ).join('\n');
    const combinedNotes = [params.notes, '--- Decision Filter ---', filterNotes, reflection]
      .filter(Boolean)
      .join('\n\n');

    const input: TaskInput = {
      title: params.title,
      notes: combinedNotes || null,
      priority: params.priority ? Number(params.priority) : 0,
      inbox: params.inbox === '1',
      scheduled_date: params.scheduled_date || null,
      due_date: params.due_date || null,
      due_time: params.due_time || null,
      evening: params.evening === '1',
      recurrence_rule: params.recurrence_rule || null,
    };

    await createTask(input);
    setSaving(false);
    router.replace('/(tabs)');
  };

  const setAnswer = (index: number, value: Answer) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.btn, { color: colors.accent }]}>Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          Decision Filter
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}>
        <Text style={[styles.intro, { color: colors.textMuted }]}>
          You're starting a major initiative: "{params.title}". Walk through the
          filter honestly before committing.
        </Text>

        {noCount >= 2 && (
          <View style={[styles.warn, { backgroundColor: colors.dangerMuted }]}>
            <Text style={[styles.warnText, { color: colors.danger }]}>
              {noCount} concerns flagged — consider simplifying, deferring, or
              moving this to inbox for later.
            </Text>
          </View>
        )}

        {DECISION_FILTER_QUESTIONS.map((question, i) => (
          <View
            key={question}
            style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.question, { color: colors.text }]}>
              {question}
            </Text>
            <View style={styles.options}>
              {(['yes', 'unsure', 'no'] as const).map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setAnswer(i, opt)}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        answers[i] === opt ? colors.accent : colors.background,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Text
                    style={{
                      color: answers[i] === opt ? '#fff' : colors.text,
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                    {opt === 'unsure' ? 'Not sure' : opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Text style={[styles.label, { color: colors.sectionHeader }]}>
          Anything else to consider?
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
          ]}
          placeholder="Blind spots, concerns, simplifications..."
          placeholderTextColor={colors.textMuted}
          value={reflection}
          onChangeText={setReflection}
          multiline
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 16, borderTopColor: colors.border },
        ]}>
        <Pressable
          onPress={handleSave}
          disabled={!allAnswered || saving}
          style={[
            styles.saveBtn,
            {
              backgroundColor: allAnswered ? colors.accent : colors.border,
            },
          ]}>
          <Text style={styles.saveText}>
            {noCount >= 3 ? 'Save anyway' : 'Commit to this initiative'}
          </Text>
        </Pressable>
      </View>
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
  btn: { fontSize: 17 },
  title: { fontSize: 17, fontWeight: '600' },
  scroll: { paddingHorizontal: 16 },
  intro: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  warn: { padding: 12, borderRadius: 10, marginBottom: 16 },
  warnText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  card: { borderRadius: 12, padding: 14, marginBottom: 12 },
  question: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  options: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
