import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import { formatDisplayDate, toDateString } from '@/lib/dates';
import { EVENING_REFLECTION_QUESTIONS } from '@/lib/personal-os';
import type { EveningReflectionInput } from '@/lib/types';

export default function EveningReflectionScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const logDate =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? date
      : toDateString();
  const isToday = logDate === toDateString();

  const { colors } = useTheme();
  const { getEveningReflection, saveEveningReflection } = useAppData();
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<EveningReflectionInput>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEveningReflection(logDate).then((r) => {
      if (r) {
        setAnswers({
          honored_god: r.honored_god ?? '',
          made_life_easier: r.made_life_easier ?? '',
          problem_solved: r.problem_solved ?? '',
          learned: r.learned ?? '',
          grateful: r.grateful ?? '',
          improve_tomorrow: r.improve_tomorrow ?? '',
        });
      } else {
        setAnswers({});
      }
    });
  }, [getEveningReflection, logDate]);

  const handleSave = async () => {
    setSaving(true);
    await saveEveningReflection(answers, logDate);
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.btn, { color: colors.accent }]}>Close</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          {isToday ? 'Evening Reflection' : formatDisplayDate(logDate)}
        </Text>
        <Pressable onPress={handleSave} disabled={saving}>
          <Text style={[styles.btn, styles.save, { color: colors.accent }]}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.form,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.intro, { color: colors.textMuted }]}>
          End your day with intention. There are no wrong answers — only honest
          ones.
        </Text>

        {EVENING_REFLECTION_QUESTIONS.map((q) => (
          <View key={q.key} style={styles.field}>
            <Text style={[styles.question, { color: colors.text }]}>
              {q.question}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Your reflection..."
              placeholderTextColor={colors.textMuted}
              value={answers[q.key as keyof EveningReflectionInput] ?? ''}
              onChangeText={(text) =>
                setAnswers((prev) => ({ ...prev, [q.key]: text }))
              }
              multiline
            />
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
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
  save: { fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '600' },
  form: { paddingHorizontal: 20 },
  intro: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  field: { marginBottom: 20 },
  question: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    fontSize: 16,
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
  },
});
