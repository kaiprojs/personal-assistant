import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionHeader, TaskRow } from '@/components/TaskUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  addDays,
  getWeekDates,
  startOfWeek,
  toDateString,
} from '@/lib/dates';
import { LIFE_BALANCE_AREAS } from '@/lib/personal-os';
import type { Task } from '@/lib/types';

type Step = 1 | 2 | 3 | 4;

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklyReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    inboxTasks,
    getCompletedSince,
    getOpenTaskCount,
    getTasksForDate,
    getUnscheduledWeekTasks,
    scheduleTaskToDate,
    deleteTask,
    getBalanceCheckin,
    saveBalanceCheckin,
  } = useAppData();

  const [step, setStep] = useState<Step>(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [openCount, setOpenCount] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayTasks, setDayTasks] = useState<Task[]>([]);
  const [unscheduled, setUnscheduled] = useState<Task[]>([]);
  const [balanceRatings, setBalanceRatings] = useState<Record<string, number>>(
    {},
  );
  const [balanceNotes, setBalanceNotes] = useState('');

  const weekDates = getWeekDates().map(toDateString);

  const loadStep1 = useCallback(async () => {
    const checkin = await getBalanceCheckin();
    if (checkin) {
      setBalanceRatings(checkin.ratings);
      setBalanceNotes(checkin.notes ?? '');
    } else {
      const defaults: Record<string, number> = {};
      for (const area of LIFE_BALANCE_AREAS) defaults[area.key] = 3;
      setBalanceRatings(defaults);
    }
  }, [getBalanceCheckin]);

  const loadStep2 = useCallback(async () => {
    const weekStart = toDateString(startOfWeek());
    const [completed, open] = await Promise.all([
      getCompletedSince(weekStart),
      getOpenTaskCount(),
    ]);
    setCompletedCount(completed.length);
    setOpenCount(open);
  }, [getCompletedSince, getOpenTaskCount]);

  const loadStep4 = useCallback(async () => {
    const dateStr = weekDates[selectedDay];
    const [day, unsched] = await Promise.all([
      getTasksForDate(dateStr),
      getUnscheduledWeekTasks(),
    ]);
    setDayTasks(day);
    setUnscheduled(unsched);
  }, [getTasksForDate, getUnscheduledWeekTasks, selectedDay, weekDates]);

  useEffect(() => {
    loadStep1();
  }, [loadStep1]);

  useEffect(() => {
    if (step === 2) loadStep2();
  }, [step, loadStep2]);

  useEffect(() => {
    if (step === 4) loadStep4();
  }, [step, loadStep4]);

  const saveBalanceAndContinue = async () => {
    await saveBalanceCheckin(balanceRatings, balanceNotes || null);
    setStep(2);
  };

  const handleContinue = async () => {
    if (step === 1) {
      await saveBalanceAndContinue();
      return;
    }
    if (step < 4) setStep((step + 1) as Step);
    else router.back();
  };

  const assignToDay = async (taskId: string) => {
    await scheduleTaskToDate(taskId, weekDates[selectedDay]);
    await loadStep4();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Weekly Review
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.steps}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              {
                backgroundColor:
                  step >= s ? colors.accent : colors.border,
              },
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}>
        {step === 1 && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Life balance check-in
            </Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>
              Rate each area honestly (1 = neglected, 5 = thriving). Never
              pursue success at the expense of these priorities.
            </Text>
            {LIFE_BALANCE_AREAS.map((area) => (
              <View
                key={area.key}
                style={[styles.balanceRow, { backgroundColor: colors.card }]}>
                <Text style={[styles.balanceLabel, { color: colors.text }]}>
                  {area.label}
                </Text>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Pressable
                      key={n}
                      onPress={() =>
                        setBalanceRatings((prev) => ({
                          ...prev,
                          [area.key]: n,
                        }))
                      }
                      style={[
                        styles.ratingBtn,
                        {
                          backgroundColor:
                            balanceRatings[area.key] === n
                              ? colors.accent
                              : colors.background,
                          borderColor: colors.border,
                        },
                      ]}>
                      <Text
                        style={{
                          color:
                            balanceRatings[area.key] === n
                              ? '#fff'
                              : colors.textMuted,
                          fontWeight: '600',
                        }}>
                        {n}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Review last week
            </Text>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Stat label="Completed" value={completedCount} colors={colors} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Stat label="Still open" value={openCount} colors={colors} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Stat label="In inbox" value={inboxTasks.length} colors={colors} />
            </View>
            <Text style={[styles.body, { color: colors.textMuted }]}>
              Take a moment to appreciate what you finished. Open tasks can be
              scheduled in the next steps.
            </Text>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Clear inbox
            </Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>
              Tap a task to schedule it, or swipe for options.
            </Text>
            {inboxTasks.length === 0 ? (
              <Text style={[styles.empty, { color: colors.textMuted }]}>
                Inbox is clear — nice work!
              </Text>
            ) : (
              <View style={[styles.list, { backgroundColor: colors.card }]}>
                {inboxTasks.map((task) => (
                  <InboxProcessRow
                    key={task.id}
                    task={task}
                    colors={colors}
                    onToday={() =>
                      scheduleTaskToDate(task.id, toDateString())
                    }
                    onTomorrow={() =>
                      scheduleTaskToDate(
                        task.id,
                        toDateString(addDays(new Date(), 1)),
                      )
                    }
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Plan your week
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayChips}>
              {weekDates.map((dateStr, i) => {
                const d = addDays(startOfWeek(), i);
                const isToday = dateStr === toDateString();
                return (
                  <Pressable
                    key={dateStr}
                    onPress={() => setSelectedDay(i)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor:
                          selectedDay === i ? colors.accent : colors.card,
                        borderColor: colors.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dayChipLabel,
                        {
                          color:
                            selectedDay === i ? '#fff' : colors.textMuted,
                        },
                      ]}>
                      {DAY_LABELS[d.getDay()]}
                    </Text>
                    <Text
                      style={[
                        styles.dayChipNum,
                        {
                          color: selectedDay === i ? '#fff' : colors.text,
                        },
                      ]}>
                      {d.getDate()}
                      {isToday ? ' ·' : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <SectionHeader
              title={DAY_LABELS[addDays(startOfWeek(), selectedDay).getDay()]}
            />
            {dayTasks.length === 0 ? (
              <Text style={[styles.empty, { color: colors.textMuted }]}>
                No tasks scheduled — assign from below
              </Text>
            ) : (
              <View style={[styles.list, { backgroundColor: colors.card }]}>
                {dayTasks.map((task) => (
                  <TaskRow key={task.id} task={task} enableSwipe={false} />
                ))}
              </View>
            )}

            {unscheduled.length > 0 && (
              <>
                <SectionHeader title="Unscheduled" count={unscheduled.length} />
                <View style={[styles.list, { backgroundColor: colors.card }]}>
                  {unscheduled.map((task) => (
                    <Pressable
                      key={task.id}
                      onPress={() => assignToDay(task.id)}
                      style={styles.unschedRow}>
                      <Text
                        style={[styles.unschedTitle, { color: colors.text }]}
                        numberOfLines={1}>
                        {task.title}
                      </Text>
                      <Text style={[styles.assign, { color: colors.accent }]}>
                        + Add
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}>
        {step > 1 && (
          <Pressable
            style={[styles.footerBtn, { borderColor: colors.border }]}
            onPress={() => setStep((step - 1) as Step)}>
            <Text style={[styles.footerBtnText, { color: colors.text }]}>
              Back
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.footerBtn, styles.footerPrimary, { backgroundColor: colors.accent }]}
          onPress={handleContinue}>
          <Text style={[styles.footerBtnText, { color: '#fff' }]}>
            {step < 4 ? 'Continue' : 'Finish week plan'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

function InboxProcessRow({
  task,
  colors,
  onToday,
  onTomorrow,
  onDelete,
}: {
  task: Task;
  colors: ReturnType<typeof useTheme>['colors'];
  onToday: () => void;
  onTomorrow: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.inboxRow}>
      <Text
        style={[styles.unschedTitle, { color: colors.text, flex: 1 }]}
        numberOfLines={2}>
        {task.title}
      </Text>
      <Pressable
        onPress={onToday}
        style={[styles.miniBtn, { backgroundColor: colors.accentMuted }]}>
        <Text style={[styles.miniBtnText, { color: colors.accent }]}>Today</Text>
      </Pressable>
      <Pressable
        onPress={onTomorrow}
        style={[styles.miniBtn, { backgroundColor: colors.accentMuted }]}>
        <Text style={[styles.miniBtnText, { color: colors.accent }]}>
          Tomorrow
        </Text>
      </Pressable>
      <Pressable onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </Pressable>
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
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  stepDot: { width: 32, height: 4, borderRadius: 2 },
  scroll: { paddingHorizontal: 16 },
  stepTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  statCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 13, marginTop: 4 },
  divider: { width: 1, marginVertical: 4 },
  list: { borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  empty: { textAlign: 'center', paddingVertical: 24, fontSize: 15 },
  dayChips: { gap: 8, paddingBottom: 16 },
  dayChip: {
    width: 56,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  dayChipLabel: { fontSize: 12, fontWeight: '600' },
  dayChipNum: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  unschedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  unschedTitle: { fontSize: 16, fontWeight: '500' },
  assign: { fontSize: 14, fontWeight: '600' },
  inboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  balanceRow: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  balanceLabel: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  miniBtnText: { fontSize: 13, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  footerPrimary: { borderWidth: 0 },
  footerBtnText: { fontSize: 16, fontWeight: '600' },
});
