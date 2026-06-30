import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import {
  CORE_VALUES,
  DECISION_FILTER_QUESTIONS,
  LONG_TERM_GOALS,
  MISSION,
  REMINDERS,
  TRUST_STATEMENT,
  USER_NAME,
} from '@/lib/personal-os';

export default function MyOsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My OS</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}>
        <Text style={[styles.name, { color: colors.text }]}>{USER_NAME}</Text>
        <Text style={[styles.role, { color: colors.textMuted }]}>
          Personal Operating System & Life Companion
        </Text>

        <Section title="Life Mission" colors={colors}>
          <Text style={[styles.body, { color: colors.text }]}>{MISSION}</Text>
          <Text style={[styles.quote, { color: colors.textMuted }]}>
            {TRUST_STATEMENT}
          </Text>
        </Section>

        <Section title="Long-Term Goals" colors={colors}>
          {LONG_TERM_GOALS.map((goal) => (
            <Bullet key={goal} text={goal} colors={colors} />
          ))}
        </Section>

        <Section title="Core Values" colors={colors}>
          {CORE_VALUES.map((value) => (
            <Bullet key={value} text={value} colors={colors} />
          ))}
        </Section>

        <Section title="Decision Filter" colors={colors}>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Before starting any major initiative, ask:
          </Text>
          {DECISION_FILTER_QUESTIONS.map((q, i) => (
            <Text key={q} style={[styles.numbered, { color: colors.text }]}>
              {i + 1}. {q}
            </Text>
          ))}
        </Section>

        <Section title="Reminders" colors={colors}>
          {REMINDERS.map((r) => (
            <Text key={r} style={[styles.reminder, { color: colors.today }]}>
              {r}
            </Text>
          ))}
        </Section>

        <Text style={[styles.footer, { color: colors.textMuted }]}>
          Your objective is not completing more tasks — it is becoming a man of
          wisdom, integrity, excellence, and faith whose work genuinely
          improves the lives of others.
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
}

function Bullet({
  text,
  colors,
}: {
  text: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bullet, { color: colors.accent }]}>•</Text>
      <Text style={[styles.bulletText, { color: colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  scroll: { paddingHorizontal: 16 },
  name: { fontSize: 32, fontWeight: '700', marginTop: 8 },
  role: { fontSize: 15, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 12, padding: 16 },
  body: { fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  quote: { fontSize: 14, lineHeight: 22, marginTop: 12 },
  hint: { fontSize: 14, marginBottom: 10 },
  numbered: { fontSize: 15, lineHeight: 24, marginBottom: 4 },
  reminder: { fontSize: 15, fontWeight: '600', marginBottom: 8, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bullet: { fontSize: 16, lineHeight: 22 },
  bulletText: { flex: 1, fontSize: 15, lineHeight: 22 },
  footer: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    fontStyle: 'italic',
  },
});
