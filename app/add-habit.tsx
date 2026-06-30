import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AddHabitScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createHabit } = useAppData();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || saving) return;
    setSaving(true);
    await createHabit({ title: title.trim() });
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.btn, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>New Habit</Text>
        <Pressable onPress={handleSave} disabled={saving || !title.trim()}>
          <Text
            style={[
              styles.btn,
              styles.save,
              {
                color: colors.accent,
                opacity: !title.trim() || saving ? 0.4 : 1,
              },
            ]}>
            Save
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          One tap each day to build your streak
        </Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          placeholder="e.g. Drink water, Read 20 min"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus
          onSubmitEditing={handleSave}
        />
      </View>
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
  body: { paddingHorizontal: 20, paddingTop: 8 },
  hint: { fontSize: 15, marginBottom: 16 },
  input: {
    fontSize: 18,
    padding: 16,
    borderRadius: 12,
  },
});
