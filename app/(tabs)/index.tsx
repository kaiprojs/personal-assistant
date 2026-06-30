import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LoadingView } from '@/components/TaskUI';
import {
  Card,
  HomeHeader,
  ProgressBar,
  ProgressRing,
  ScreenScroll,
  SectionLabel,
} from '@/components/ui/OSUI';
import { WeekPlanBanner } from '@/components/WeekPlanBanner';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getDailyVerse,
  getGreeting,
  isReflectionTime,
  QUICK_ADD_ACTIONS,
} from '@/lib/personal-os';
import { useTabBarHeight } from '@/lib/tab-bar-insets';
import {
  formatVerseSubtitle,
  isScriptureSaved,
  saveScripture,
} from '@/lib/scripture';
import { toDateString, formatDisplayDate, formatFullDate } from '@/lib/dates';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    loading,
    primaryFocus,
    todayBuckets,
    habits,
    habitDoneToday,
    hasReflectionToday,
    toggleHabitToday,
    lifeProfile,
    updateLifeProfile,
  } = useAppData();

  if (loading) return <LoadingView />;

  const verse = getDailyVerse();
  const faith = lifeProfile.faith;
  const today = toDateString();
  const verseSaved = isScriptureSaved(faith, verse.reference, today);

  const tabBarHeight = useTabBarHeight();

  const toggleSaveVerse = () => {
    if (verseSaved) return;
    updateLifeProfile('faith', saveScripture(faith, verse, today));
  };
  const scheduled = [
    ...todayBuckets.overdue,
    ...todayBuckets.today,
    ...todayBuckets.evening,
  ].slice(0, 4);

  const habitIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Morning devotion': 'sunny',
    'Bible study': 'book',
    'Move my body': 'fitness',
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenScroll>
        <HomeHeader />
        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {formatFullDate()}
          </Text>
        </View>

        <Card style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <View style={styles.verseHeaderLeft}>
              <Ionicons name="heart" size={18} color={colors.green} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.verseRef, { color: colors.green }]}>
                  {verse.reference}
                </Text>
                <Text style={[styles.verseTheme, { color: colors.textMuted }]}>
                  {formatVerseSubtitle(verse)}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={toggleSaveVerse}
              hitSlop={8}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: verseSaved ? colors.greenMuted : colors.cardElevated,
                },
              ]}>
              <Ionicons
                name={verseSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={verseSaved ? colors.green : colors.textMuted}
              />
            </Pressable>
          </View>
          <Text style={[styles.verseText, { color: colors.text }]}>
            {verse.text}
          </Text>
          {verseSaved ? (
            <Text style={[styles.savedHint, { color: colors.green }]}>
              Saved to Scripture
            </Text>
          ) : null}
        </Card>

        <SectionLabel title="Today's Focus" />
        <Card onPress={() => router.push('/primary-focus')}>
          <View style={styles.focusRow}>
            <View style={{ flex: 1 }}>
              <View style={[styles.priorityTag, { backgroundColor: colors.greenMuted }]}>
                <Text style={[styles.priorityText, { color: colors.green }]}>
                  Top Priority
                </Text>
              </View>
              <Text style={[styles.focusTitle, { color: colors.text }]}>
                {primaryFocus?.title ?? 'Set your primary project'}
              </Text>
              {primaryFocus?.description ? (
                <Text style={[styles.focusSub, { color: colors.textMuted }]} numberOfLines={2}>
                  {primaryFocus.description}
                </Text>
              ) : null}
            </View>
            <ProgressRing progress={primaryFocus?.progress ?? 0} />
          </View>
        </Card>

        {isReflectionTime() && !hasReflectionToday && (
          <Pressable
            onPress={() => router.push('/evening-reflection')}
            style={[styles.reflectBanner, { backgroundColor: colors.eveningMuted }]}>
            <Ionicons name="moon" size={18} color={colors.evening} />
            <Text style={[styles.reflectText, { color: colors.evening }]}>
              Evening reflection — take 5 minutes
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.evening} />
          </Pressable>
        )}

        <WeekPlanBanner />

        <SectionLabel title="Today at a Glance" />
        <Card>
          {scheduled.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              Nothing scheduled — tap Quick Add below
            </Text>
          ) : (
            scheduled.map((task, i) => (
              <View
                key={task.id}
                style={[
                  styles.glanceRow,
                  i < scheduled.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}>
                <View
                  style={[
                    styles.glanceIcon,
                    {
                      backgroundColor:
                        task.evening ? colors.purpleMuted : colors.blueMuted,
                    },
                  ]}>
                  <Ionicons
                    name={task.evening ? 'moon' : 'briefcase'}
                    size={16}
                    color={task.evening ? colors.purple : colors.blue}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.glanceTitle, { color: colors.text }]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.glanceSub, { color: colors.textMuted }]}>
                    {formatDisplayDate(task.scheduled_date ?? task.due_date)}
                    {task.due_time ? ` · ${task.due_time}` : ''}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {habits.length > 0 && (
          <>
            <SectionLabel title="Habits" />
            <Card>
              {habits.map((habit, i) => (
                <Pressable
                  key={habit.id}
                  onPress={() => toggleHabitToday(habit.id)}
                  style={[
                    styles.glanceRow,
                    i < habits.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}>
                  <View
                    style={[styles.glanceIcon, { backgroundColor: `${habit.color}33` }]}>
                    <Ionicons
                      name={habitIcons[habit.title] ?? 'checkmark-circle'}
                      size={16}
                      color={habit.color}
                    />
                  </View>
                  <Text style={[styles.glanceTitle, { color: colors.text, flex: 1 }]}>
                    {habit.title}
                  </Text>
                  <Ionicons
                    name={habitDoneToday[habit.id] ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={habitDoneToday[habit.id] ? colors.green : colors.checkbox}
                  />
                </Pressable>
              ))}
            </Card>
          </>
        )}

        <SectionLabel title="Quick Add" />
        <View style={styles.quickAdd}>
          {QUICK_ADD_ACTIONS.map((action) => (
            <Pressable
              key={action.route}
              onPress={() => router.push(action.route as never)}
              style={styles.quickBtn}>
              <View style={[styles.quickIcon, { backgroundColor: colors.card }]}>
                <Ionicons name={action.icon} size={22} color={colors.accent} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.textMuted }]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScreenScroll>

      <Pressable
        onPress={() => router.push('/add-task')}
        style={[styles.fab, { backgroundColor: colors.fab, bottom: tabBarHeight + 16 }]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  greetingBlock: { paddingHorizontal: 20, marginBottom: 16 },
  greeting: { fontSize: 28, fontWeight: '700' },
  date: { fontSize: 15, marginTop: 4 },
  verseCard: { gap: 8 },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  verseHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  verseRef: { fontSize: 13, fontWeight: '700' },
  verseTheme: { fontSize: 11, marginTop: 2 },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseText: { fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
  savedHint: { fontSize: 12, fontWeight: '600' },
  focusRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  priorityTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  priorityText: { fontSize: 11, fontWeight: '700' },
  focusTitle: { fontSize: 18, fontWeight: '700' },
  focusSub: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  reflectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
  },
  reflectText: { flex: 1, fontSize: 14, fontWeight: '600' },
  glanceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  glanceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glanceTitle: { fontSize: 16, fontWeight: '500' },
  glanceSub: { fontSize: 13, marginTop: 2 },
  empty: { fontSize: 15, textAlign: 'center', paddingVertical: 8 },
  quickAdd: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  quickBtn: { alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { fontSize: 11, fontWeight: '500' },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
