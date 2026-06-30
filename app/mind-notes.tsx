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

import { Card } from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { generateId, nowIso } from '@/lib/dates';
import type { MindProfile } from '@/lib/life-profile';

export default function MindNotesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const notes = lifeProfile.mind.notes;

  const addNote = async () => {
    if (!text.trim()) return;
    const next: MindProfile = {
      ...lifeProfile.mind,
      notes: [
        { id: generateId(), text: text.trim(), createdAt: nowIso() },
        ...notes,
      ],
    };
    await updateLifeProfile('mind', next);
    setText('');
  };

  const deleteNote = async (id: string) => {
    await updateLifeProfile('mind', {
      ...lifeProfile.mind,
      notes: notes.filter((n) => n.id !== id),
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.accent, fontSize: 17 }}>Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Notes & Ideas</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.compose, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Capture an idea..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable
          onPress={addNote}
          style={[styles.addBtn, { backgroundColor: colors.accent }]}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {notes.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            No notes yet. Capture ideas as you learn.
          </Text>
        ) : (
          notes.map((note) => (
            <Pressable key={note.id} onLongPress={() => deleteNote(note.id)}>
              <Card style={{ marginHorizontal: 0 }}>
                <Text style={[styles.noteText, { color: colors.text }]}>
                  {note.text}
                </Text>
                <Text style={[styles.noteDate, { color: colors.textMuted }]}>
                  {note.createdAt.slice(0, 10)} · long-press to delete
                </Text>
              </Card>
            </Pressable>
          ))
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
  title: { fontSize: 17, fontWeight: '600' },
  compose: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  input: { fontSize: 16, minHeight: 60, textAlignVertical: 'top' },
  addBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
  noteText: { fontSize: 16, lineHeight: 22 },
  noteDate: { fontSize: 12, marginTop: 8 },
});
