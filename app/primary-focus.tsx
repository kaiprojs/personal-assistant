import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
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
import { ProgressBar } from '@/components/ui/OSUI';
import { PRODUCTIVITY_RULES } from '@/lib/personal-os';

export default function PrimaryFocusScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { primaryFocus, setPrimaryFocus, clearPrimaryFocus, setPrimaryFocusProgress } =
    useAppData();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (primaryFocus) {
      setTitle(primaryFocus.title);
      setDescription(primaryFocus.description ?? '');
      setProgress(primaryFocus.progress ?? 0);
    }
  }, [primaryFocus]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'What is your primary project right now?');
      return;
    }
    setSaving(true);
    await setPrimaryFocus(title, description || null);
    await setPrimaryFocusProgress(progress);
    setSaving(false);
    router.back();
  };

  const handleClear = () => {
    Alert.alert('Clear primary focus', 'Remove your current primary project?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearPrimaryFocus();
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.btn, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.toolbarTitle, { color: colors.text }]}>
          Primary Project
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
        {PRODUCTIVITY_RULES.map((rule) => (
          <Text key={rule} style={[styles.rule, { color: colors.textMuted }]}>
            · {rule}
          </Text>
        ))}

        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          placeholder="e.g. CCNA certification study"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <TextInput
          style={[
            styles.descInput,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Why this matters right now (optional)"
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
          Progress · {progress}%
        </Text>
        <ProgressBar progress={progress} />
        <View style={styles.progressBtns}>
          {[0, 25, 50, 75, 100].map((pct) => (
            <Pressable
              key={pct}
              onPress={() => setProgress(pct)}
              style={[
                styles.progressChip,
                {
                  backgroundColor:
                    progress === pct ? colors.accentMuted : colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                {pct}%
              </Text>
            </Pressable>
          ))}
        </View>

        {primaryFocus && (
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Text style={[styles.clearText, { color: colors.danger }]}>
              Clear primary project
            </Text>
          </Pressable>
        )}
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
  toolbarTitle: { fontSize: 17, fontWeight: '600' },
  form: { paddingHorizontal: 20, paddingTop: 8 },
  rule: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  titleInput: { fontSize: 22, fontWeight: '600', marginTop: 20, marginBottom: 16 },
  descInput: {
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
  },
  progressLabel: { fontSize: 13, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  progressBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  progressChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  clearBtn: { marginTop: 32, alignItems: 'center', padding: 12 },
  clearText: { fontSize: 16, fontWeight: '500' },
});
