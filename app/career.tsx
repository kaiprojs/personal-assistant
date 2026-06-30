import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditValueModal } from '@/components/ui/EditValueModal';
import {
  Card,
  MenuRow,
  ProgressBar,
  ScreenHeader,
  ScreenScroll,
  SectionLabel,
} from '@/components/ui/OSUI';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toDateString } from '@/lib/dates';
import type { CareerProfile } from '@/lib/life-profile';

type EditField = 'role' | 'goal' | 'goalProgress' | 'cert' | 'jobs' | null;

export default function CareerScreen() {
  const { colors } = useTheme();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const career = lifeProfile.career;
  const [edit, setEdit] = useState<{ field: EditField; certId?: string }>({
    field: null,
  });

  const save = (next: CareerProfile) => updateLifeProfile('career', next);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Career" icon="briefcase" />
      <ScreenScroll>
        <Card onPress={() => setEdit({ field: 'role' })}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Current Role</Text>
          <Text style={[styles.value, { color: colors.text }]}>{career.role}</Text>
        </Card>

        <Card onPress={() => setEdit({ field: 'goal' })}>
          <Text style={[styles.label, { color: colors.textMuted }]}>Primary Goal</Text>
          <Text style={[styles.value, { color: colors.text }]}>{career.goal}</Text>
          <ProgressBar progress={career.goalProgress} color={colors.orange} />
          <Pressable
            onPress={() => setEdit({ field: 'goalProgress' })}
            style={styles.tapHint}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              Tap to edit goal · tap bar to set progress
            </Text>
          </Pressable>
        </Card>

        <SectionLabel title="Certifications" />
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {career.certifications.map((cert, i) => (
            <Pressable
              key={cert.id}
              onPress={() => setEdit({ field: 'cert', certId: cert.id })}
              style={[
                styles.certRow,
                i < career.certifications.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}>
              <Text style={[styles.certTitle, { color: colors.text }]}>
                {cert.title}
              </Text>
              <Text
                style={[
                  styles.certStatus,
                  {
                    color:
                      cert.status === 'In Progress' ? colors.green : colors.textMuted,
                  },
                ]}>
                {cert.status}
              </Text>
            </Pressable>
          ))}
        </Card>

        <SectionLabel title="Long-term goals" />
        <Card>
          {lifeProfile.identity.longTermGoals.slice(0, 4).map((goal, i, arr) => (
            <Text
              key={goal}
              style={[
                styles.goalItem,
                { color: colors.text },
                i < arr.length - 1 && {
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

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <MenuRow
            icon="document"
            label="Resume & Portfolio"
            subtitle={
              career.resumeUpdated
                ? `Updated ${career.resumeUpdated}`
                : 'Tap to mark updated today'
            }
            onPress={() =>
              save({ ...career, resumeUpdated: toDateString() })
            }
          />
          <MenuRow
            icon="briefcase"
            label="Job Opportunities"
            badge={career.jobOpportunities}
            onPress={() => setEdit({ field: 'jobs' })}
            last
          />
        </Card>
      </ScreenScroll>

      {edit.field === 'role' && (
        <EditValueModal
          visible
          title="Current role"
          value={career.role}
          onClose={() => setEdit({ field: null })}
          onSave={(v) => save({ ...career, role: v.trim() })}
        />
      )}
      {edit.field === 'goal' && (
        <EditValueModal
          visible
          title="Primary career goal"
          value={career.goal}
          mode="multiline"
          onClose={() => setEdit({ field: null })}
          onSave={(v) => save({ ...career, goal: v.trim() })}
        />
      )}
      {edit.field === 'goalProgress' && (
        <EditValueModal
          visible
          title="Goal progress %"
          value={String(career.goalProgress)}
          mode="number"
          onClose={() => setEdit({ field: null })}
          onSave={(v) =>
            save({
              ...career,
              goalProgress: Math.max(0, Math.min(100, Number(v) || 0)),
            })
          }
        />
      )}
      {edit.field === 'jobs' && (
        <EditValueModal
          visible
          title="Open job opportunities"
          value={String(career.jobOpportunities)}
          mode="number"
          onClose={() => setEdit({ field: null })}
          onSave={(v) =>
            save({ ...career, jobOpportunities: Math.max(0, Number(v) || 0) })
          }
        />
      )}
      {edit.field === 'cert' && edit.certId && (
        <EditValueModal
          visible
          title="Certification status"
          value={
            career.certifications.find((c) => c.id === edit.certId)?.status ?? ''
          }
          onClose={() => setEdit({ field: null })}
          onSave={(v) =>
            save({
              ...career,
              certifications: career.certifications.map((c) =>
                c.id === edit.certId
                  ? {
                      ...c,
                      status: v.trim() || c.status,
                    }
                  : c,
              ),
            })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  tapHint: { marginTop: 8 },
  certRow: { padding: 16 },
  certTitle: { fontSize: 16, fontWeight: '600' },
  certStatus: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  goalItem: { fontSize: 15, lineHeight: 22 },
});
