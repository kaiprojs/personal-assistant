import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  Card,
  CheckRow,
  QuoteCard,
  ScreenHeader,
  ScreenScroll,
} from '@/components/ui/OSUI';
import { useTheme } from '@/contexts/ThemeContext';
import { useDailyChecklist } from '@/hooks/useDailyChecklist';
import { CHARACTER_VIRTUES } from '@/lib/personal-os';

export default function CharacterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const keys = CHARACTER_VIRTUES.map((v) => v.key);
  const { checked, toggle } = useDailyChecklist('character', keys);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Character" icon="shield-checkmark" />
      <ScreenScroll>
        <Card style={{ paddingVertical: 4 }}>
          {CHARACTER_VIRTUES.map((virtue, i) => (
            <CheckRow
              key={virtue.key}
              label={virtue.label}
              subtitle={virtue.subtitle}
              checked={checked[virtue.key] ?? false}
              onToggle={() => toggle(virtue.key)}
              showDivider={i < CHARACTER_VIRTUES.length - 1}
            />
          ))}
        </Card>

        <Card onPress={() => router.push('/evening-reflection')}>
          <Text style={[styles.reflectLabel, { color: colors.textMuted }]}>
            Daily Reflection
          </Text>
          <Text style={[styles.reflectPrompt, { color: colors.text }]}>
            How did I reflect Christ today?
          </Text>
        </Card>

        <QuoteCard
          text="Success without character is failure."
          icon="heart"
          iconColor={colors.green}
        />
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  reflectLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  reflectPrompt: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
});
