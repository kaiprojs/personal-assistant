import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditValueModal } from '@/components/ui/EditValueModal';
import {
  Card,
  QuoteCard,
  ScreenHeader,
  ScreenScroll,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { HEALTH_METRICS } from '@/lib/personal-os';

export default function HealthScreen() {
  const { colors } = useTheme();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const metrics = lifeProfile.health.metrics;
  const [editing, setEditing] = useState<{ key: string; label: string } | null>(
    null,
  );

  const saveMetric = async (key: string, value: string) => {
    await updateLifeProfile('health', {
      metrics: { ...metrics, [key]: value },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Health" icon="fitness" />
      <ScreenScroll>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Tap any metric to update today's log.
        </Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {HEALTH_METRICS.map((metric, i) => (
            <Pressable
              key={metric.key}
              onPress={() => setEditing({ key: metric.key, label: metric.label })}
              style={[
                styles.row,
                i < HEALTH_METRICS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}>
              <View style={[styles.icon, { backgroundColor: colors.redMuted }]}>
                <Ionicons name={metric.icon} size={18} color={colors.red} />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>
                {metric.label}
              </Text>
              <Text style={[styles.value, { color: colors.textMuted }]}>
                {metrics[metric.key] ?? metric.value}
              </Text>
              <Ionicons name="create-outline" size={16} color={colors.textMuted} />
            </Pressable>
          ))}
        </Card>

        <QuoteCard
          text="Your body is a temple. Honor God by caring for your health."
          icon="heart"
          iconColor={colors.red}
        />
      </ScreenScroll>

      {editing && (
        <EditValueModal
          visible
          title={editing.label}
          value={metrics[editing.key] ?? ''}
          onClose={() => setEditing(null)}
          onSave={(value) => saveMetric(editing.key, value)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, paddingHorizontal: 20, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 16, fontWeight: '500' },
  value: { fontSize: 15, fontWeight: '600' },
});
