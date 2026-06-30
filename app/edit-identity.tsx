import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import type { IdentityProfile } from '@/lib/life-profile';

export default function EditIdentityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<IdentityProfile>(lifeProfile.identity);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateLifeProfile('identity', {
      ...draft,
      coreValues: draft.coreValues.filter(Boolean),
      longTermGoals: draft.longTermGoals.filter(Boolean),
    });
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.accent, fontSize: 17 }}>Cancel</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Edit Identity</Text>
        <Pressable onPress={handleSave} disabled={saving}>
          <Text style={{ color: colors.accent, fontSize: 17, fontWeight: '600' }}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Field
          label="Mission"
          value={draft.mission}
          onChange={(mission) => setDraft((d) => ({ ...d, mission }))}
          colors={colors}
          multiline
        />
        <Field
          label="Vision"
          value={draft.vision}
          onChange={(vision) => setDraft((d) => ({ ...d, vision }))}
          colors={colors}
          multiline
        />
        <Field
          label="Core values (one per line)"
          value={draft.coreValues.join('\n')}
          onChange={(text) =>
            setDraft((d) => ({
              ...d,
              coreValues: text.split('\n').map((v) => v.trim()),
            }))
          }
          colors={colors}
          multiline
        />
        <Field
          label="Long-term goals (one per line)"
          value={draft.longTermGoals.join('\n')}
          onChange={(text) =>
            setDraft((d) => ({
              ...d,
              longTermGoals: text.split('\n').map((v) => v.trim()),
            }))
          }
          colors={colors}
          multiline
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChange,
  colors,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
            minHeight: multiline ? 100 : 48,
          },
        ]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        textAlignVertical="top"
      />
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
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
});
