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
import type { FinanceProfile } from '@/lib/life-profile';

type EditField = 'savingsProgress' | 'houseFund' | 'accounts' | null;

export default function FinanceScreen() {
  const { colors } = useTheme();
  const { lifeProfile, updateLifeProfile } = useAppData();
  const finance = lifeProfile.finance;
  const [edit, setEdit] = useState<EditField>(null);

  const save = (next: FinanceProfile) => updateLifeProfile('finance', next);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Finance" icon="wallet" />
      <ScreenScroll>
        <Text style={[styles.intro, { color: colors.textMuted }]}>
          Long-term goals only for now — no income or expense tracking yet. You can
          add that when you're working and ready.
        </Text>

        <SectionLabel title="Savings goal" />
        <Card>
          <Pressable onPress={() => setEdit('savingsProgress')}>
            <ProgressBar progress={finance.savingsProgress} color={colors.green} />
            <Text style={[styles.tapHint, { color: colors.textMuted }]}>
              {finance.savingsProgress}% toward your savings goal · tap to edit
            </Text>
          </Pressable>
        </Card>

        <SectionLabel title="House fund" />
        <Card>
          <Pressable onPress={() => setEdit('houseFund')}>
            <ProgressBar progress={finance.houseFundProgress} color={colors.blue} />
            <Text style={[styles.tapHint, { color: colors.textMuted }]}>
              {finance.houseFundProgress}% toward real estate · tap to edit
            </Text>
          </Pressable>
        </Card>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <MenuRow
            icon="trending-up"
            label="Investments"
            subtitle={`${finance.investmentAccounts} accounts · tap to edit`}
            onPress={() => setEdit('accounts')}
            last
          />
        </Card>
      </ScreenScroll>

      {edit === 'savingsProgress' && (
        <EditValueModal
          visible
          title="Savings goal progress %"
          value={String(finance.savingsProgress)}
          mode="number"
          onClose={() => setEdit(null)}
          onSave={(v) =>
            save({
              ...finance,
              savingsProgress: Math.max(0, Math.min(100, Number(v) || 0)),
            })
          }
        />
      )}
      {edit === 'houseFund' && (
        <EditValueModal
          visible
          title="House fund progress %"
          value={String(finance.houseFundProgress)}
          mode="number"
          onClose={() => setEdit(null)}
          onSave={(v) =>
            save({
              ...finance,
              houseFundProgress: Math.max(0, Math.min(100, Number(v) || 0)),
            })
          }
        />
      )}
      {edit === 'accounts' && (
        <EditValueModal
          visible
          title="Investment accounts"
          value={String(finance.investmentAccounts)}
          mode="number"
          onClose={() => setEdit(null)}
          onSave={(v) =>
            save({ ...finance, investmentAccounts: Math.max(0, Number(v) || 0) })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tapHint: { fontSize: 13, marginTop: 8 },
});
