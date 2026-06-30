import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, ScreenHeader, ScreenScroll } from '@/components/ui/OSUI';
import { useTheme } from '@/contexts/ThemeContext';
import { useDailyChecklist } from '@/hooks/useDailyChecklist';
import { LIFE_COMPASS } from '@/lib/personal-os';

export default function LifeCompassScreen() {
  const { colors } = useTheme();
  const keys = LIFE_COMPASS.map((p) => p.key);
  const { checked, toggle } = useDailyChecklist('compass', keys);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Life Compass" icon="compass" />
      <ScreenScroll>
        <Card style={{ paddingVertical: 4 }}>
          {LIFE_COMPASS.map((principle, i) => {
            const done = checked[principle.key] ?? false;
            return (
              <Pressable
                key={principle.key}
                onPress={() => toggle(principle.key)}
                style={[
                  styles.row,
                  i < LIFE_COMPASS.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}>
                <View
                  style={[styles.icon, { backgroundColor: `${principle.color}33` }]}>
                  <Ionicons name={principle.icon} size={18} color={principle.color} />
                </View>
                <Text style={[styles.label, { color: colors.text }]}>
                  {principle.label}
                </Text>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: done ? colors.checkboxDone : colors.checkbox,
                      backgroundColor: done ? colors.checkboxDone : 'transparent',
                    },
                  ]}>
                  {done && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </Pressable>
            );
          })}
        </Card>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 16, fontWeight: '600' },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
