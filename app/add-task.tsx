import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
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
import { getTaskById } from '@/db/tasks';
import { addDays, toDateString } from '@/lib/dates';
import { RECURRENCE_OPTIONS } from '@/lib/recurrence';
import type { TaskInput } from '@/lib/types';

export default function AddTaskScreen() {
  const { id, inbox: inboxParam } = useLocalSearchParams<{
    id?: string;
    inbox?: string;
  }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const { createTask, updateTask, deleteTask } = useAppData();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState(0);
  const [inbox, setInbox] = useState(inboxParam === '1');
  const [evening, setEvening] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<string | null>(null);
  const [majorInitiative, setMajorInitiative] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEdit = !!id;

  const loadTask = useCallback(async () => {
    if (!id) return;
    const task = await getTaskById(db, id);
    if (!task) return;
    setTitle(task.title);
    setNotes(task.notes ?? '');
    setPriority(task.priority);
    setInbox(task.inbox === 1);
    setEvening(task.evening === 1);
    setScheduledDate(task.scheduled_date);
    setDueDate(task.due_date);
    setDueTime(task.due_time);
    setRecurrence(task.recurrence_rule);
  }, [db, id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const buildInput = (): TaskInput => ({
    title,
    notes: notes || null,
    priority,
    inbox,
    evening,
    scheduled_date: inbox ? null : scheduledDate,
    due_date: inbox ? null : dueDate,
    due_time: dueTime,
    recurrence_rule: recurrence,
  });

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Enter what you need to do.');
      return;
    }

    if (!isEdit && majorInitiative) {
      router.push({
        pathname: '/decision-filter',
        params: {
          title: title.trim(),
          notes: notes || '',
          priority: String(priority),
          inbox: inbox ? '1' : '0',
          scheduled_date: scheduledDate ?? '',
          due_date: dueDate ?? '',
          due_time: dueTime ?? '',
          evening: evening ? '1' : '0',
          recurrence_rule: recurrence ?? '',
        },
      });
      return;
    }

    setSaving(true);
    if (isEdit && id) {
      await updateTask(id, buildInput());
    } else {
      await createTask(buildInput());
    }
    setSaving(false);
    router.back();
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert('Delete task', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(id);
          router.back();
        },
      },
    ]);
  };

  const setToday = () => {
    const today = toDateString();
    setInbox(false);
    setEvening(false);
    setScheduledDate(today);
    setDueDate(today);
  };

  const setTomorrow = () => {
    const tomorrow = toDateString(addDays(new Date(), 1));
    setInbox(false);
    setEvening(false);
    setScheduledDate(tomorrow);
    setDueDate(tomorrow);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.toolbar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.toolbarBtn, { color: colors.accent }]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={[styles.toolbarTitle, { color: colors.text }]}>
          {isEdit ? 'Edit Task' : 'New Task'}
        </Text>
        <Pressable onPress={handleSave} disabled={saving}>
          <Text
            style={[
              styles.toolbarBtn,
              styles.saveBtn,
              { color: colors.accent, opacity: saving ? 0.5 : 1 },
            ]}>
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
        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          placeholder="What do you need to do?"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus={!isEdit}
        />

        {!isEdit && (
          <>
            <Label text="Initiative type" colors={colors} />
            <View style={styles.chips}>
              <Chip
                label="Regular task"
                active={!majorInitiative}
                colors={colors}
                onPress={() => setMajorInitiative(false)}
              />
              <Chip
                label="Major initiative"
                active={majorInitiative}
                colors={colors}
                onPress={() => setMajorInitiative(true)}
              />
            </View>
            {majorInitiative && (
              <Text style={[styles.filterHint, { color: colors.textMuted }]}>
                You'll walk through the decision filter before saving.
              </Text>
            )}
          </>
        )}

        <TextInput
          style={[
            styles.notesInput,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Notes (optional)"
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Label text="Schedule" colors={colors} />
        <View style={styles.chips}>
          <Chip
            label="Inbox"
            active={inbox}
            colors={colors}
            onPress={() => {
              setInbox(true);
              setScheduledDate(null);
              setDueDate(null);
              setEvening(false);
            }}
          />
          <Chip label="Today" active={!inbox && scheduledDate === toDateString() && !evening} colors={colors} onPress={setToday} />
          <Chip
            label="Tomorrow"
            active={
              !inbox &&
              scheduledDate === toDateString(addDays(new Date(), 1))
            }
            colors={colors}
            onPress={setTomorrow}
          />
          <Chip
            label="This Evening"
            active={evening}
            colors={colors}
            onPress={() => {
              setInbox(false);
              setEvening(true);
              const today = toDateString();
              setScheduledDate(today);
              setDueDate(today);
            }}
          />
        </View>

        <Label text="Priority" colors={colors} />
        <View style={styles.chips}>
          {[0, 1, 2, 3, 4].map((p) => (
            <Chip
              key={p}
              label={p === 0 ? 'None' : `P${p}`}
              active={priority === p}
              colors={colors}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>

        <Label text="Reminder time (optional)" colors={colors} />
        <View style={styles.chips}>
          {['09:00', '12:00', '17:00', '20:00'].map((t) => (
            <Chip
              key={t}
              label={t}
              active={dueTime === t}
              colors={colors}
              onPress={() => setDueTime(dueTime === t ? null : t)}
            />
          ))}
        </View>

        <Label text="Repeat" colors={colors} />
        <View style={styles.chips}>
          <Chip
            label="None"
            active={!recurrence}
            colors={colors}
            onPress={() => setRecurrence(null)}
          />
          {RECURRENCE_OPTIONS.map((r) => (
            <Chip
              key={r.value}
              label={r.label}
              active={recurrence === r.value}
              colors={colors}
              onPress={() => setRecurrence(r.value)}
            />
          ))}
        </View>

        {isEdit && (
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={[styles.deleteText, { color: colors.danger }]}>
              Delete task
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({
  text,
  colors,
}: {
  text: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Text style={[styles.label, { color: colors.sectionHeader }]}>{text}</Text>
  );
}

function Chip({
  label,
  active,
  colors,
  onPress,
}: {
  label: string;
  active: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.accent : colors.card,
          borderColor: colors.border,
        },
      ]}>
      <Text style={[styles.chipText, { color: active ? '#fff' : colors.text }]}>
        {label}
      </Text>
    </Pressable>
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
  toolbarBtn: { fontSize: 17 },
  saveBtn: { fontWeight: '600' },
  toolbarTitle: { fontSize: 17, fontWeight: '600' },
  form: { paddingHorizontal: 20, gap: 8 },
  titleInput: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  notesInput: {
    fontSize: 16,
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 14, fontWeight: '500' },
  filterHint: { fontSize: 13, marginBottom: 8, lineHeight: 18 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    paddingVertical: 14,
  },
  deleteText: { fontSize: 16, fontWeight: '500' },
});
