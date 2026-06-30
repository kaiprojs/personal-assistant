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

import {
  EmptyState,
  LoadingView,
  TaskRow,
} from '@/components/TaskUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function InboxScreen() {
  const { colors } = useTheme();
  const { loading, inboxTasks, createTask } = useAppData();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    const title = text.trim();
    if (!title || saving) return;
    setSaving(true);
    await createTask({ title, inbox: true });
    setText('');
    setSaving(false);
  };

  if (loading) return <LoadingView />;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 16 },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Capture now, organize later
          </Text>
        </View>

        <View style={[styles.inputCard, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Quick capture..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <Pressable
            onPress={handleAdd}
            disabled={!text.trim() || saving}
            style={[
              styles.addBtn,
              {
                backgroundColor: text.trim() ? colors.accent : colors.border,
              },
            ]}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {inboxTasks.length === 0 ? (
          <EmptyState
            title="Inbox is empty"
            subtitle="Dump ideas, chores, and thoughts here"
            icon="file-tray-full-outline"
          />
        ) : (
          <View style={[styles.list, { backgroundColor: colors.card }]}>
            {inboxTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 8 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  subtitle: { fontSize: 15 },
  inputCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  input: { fontSize: 17, minHeight: 44 },
  addBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  list: { marginHorizontal: 16, marginTop: 16, borderRadius: 12, overflow: 'hidden' },
});
