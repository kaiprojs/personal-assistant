import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Card,
  ScreenHeader,
  ScreenScroll,
  SectionLabel,
  TagPill,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function IdentityScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { lifeProfile } = useAppData();
  const identity = lifeProfile.identity;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Identity" icon="person" />
      <ScreenScroll>
        <Pressable
          onPress={() => router.push('/edit-identity')}
          style={[styles.editBtn, { backgroundColor: colors.accentMuted }]}>
          <Text style={[styles.editText, { color: colors.accent }]}>
            Edit mission, vision & values
          </Text>
        </Pressable>

        <SectionLabel title="Mission" />
        <Card>
          <Text style={[styles.body, { color: colors.text }]}>{identity.mission}</Text>
        </Card>

        <SectionLabel title="Vision" />
        <Card>
          <Text style={[styles.body, { color: colors.text }]}>{identity.vision}</Text>
        </Card>

        <SectionLabel title="Core Values" />
        <View style={styles.tags}>
          {identity.coreValues.map((value) => (
            <TagPill key={value} label={value} outline />
          ))}
        </View>

        <SectionLabel title="Long-term Goals" />
        <Card>
          {identity.longTermGoals.map((goal, i) => (
            <Text
              key={goal}
              style={[
                styles.goal,
                { color: colors.text },
                i < identity.longTermGoals.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                  paddingBottom: 10,
                  marginBottom: 10,
                },
              ]}>
              · {goal}
            </Text>
          ))}
        </Card>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  editText: { fontSize: 15, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24 },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  goal: { fontSize: 15, lineHeight: 22 },
});
