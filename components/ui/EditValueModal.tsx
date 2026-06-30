import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

type EditMode = 'text' | 'number' | 'multiline';

export function EditValueModal({
  visible,
  title,
  value,
  mode = 'text',
  onClose,
  onSave,
}: {
  visible: boolean;
  title: string;
  value: string;
  mode?: EditMode;
  onClose: () => void;
  onSave: (value: string) => void;
}) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.center}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  minHeight: mode === 'multiline' ? 120 : 48,
                },
              ]}
              value={draft}
              onChangeText={setDraft}
              keyboardType={mode === 'number' ? 'numeric' : 'default'}
              multiline={mode === 'multiline'}
              autoFocus
            />
            <View style={styles.actions}>
              <Pressable onPress={onClose} style={styles.actionBtn}>
                <Text style={{ color: colors.textMuted, fontSize: 16 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onSave(draft);
                  onClose();
                }}
                style={styles.actionBtn}>
                <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '600' }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  center: { width: '100%' },
  sheet: { borderRadius: 16, padding: 20, gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 },
  actionBtn: { paddingVertical: 8 },
});
