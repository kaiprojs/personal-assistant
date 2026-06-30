import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/contexts/ThemeContext';
import { useTabBarHeight } from '@/lib/tab-bar-insets';
import type { ThemeColors } from '@/lib/theme';

export function ScreenScroll({
  children,
  bottomPad = 24,
}: {
  children: ReactNode;
  bottomPad?: number;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const tabBarHeight = useTabBarHeight();
  const inTabs = segments[0] === '(tabs)';
  const scrollBottom = bottomPad + (inTabs ? tabBarHeight : insets.bottom);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: scrollBottom }}>
      {children}
    </ScrollView>
  );
}

export function ScreenHeader({
  title,
  icon,
  showBack = true,
  onMenu,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  showBack?: boolean;
  onMenu?: () => void;
}) {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {showBack ? (
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.headerBtn} />
      )}
      <View style={styles.headerCenter}>
        {icon && <Ionicons name={icon} size={18} color={colors.textMuted} />}
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Pressable onPress={onMenu} hitSlop={12} style={styles.headerBtn}>
        <Ionicons name="ellipsis-horizontal" size={22} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

export function HomeHeader() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.homeHeader, { paddingTop: insets.top + 12 }]}>
      <View style={{ flex: 1 }} />
      <Pressable hitSlop={12} onPress={() => router.push('/more')}>
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const content = (
    <View style={[styles.card, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
  if (onPress) return <Pressable onPress={onPress}>{content}</Pressable>;
  return content;
}

export function SectionLabel({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  if (action && onAction) {
    return (
      <View style={styles.sectionLabelRow}>
        <Text style={[styles.sectionLabel, { color: colors.sectionHeader }]}>
          {title.toUpperCase()}
        </Text>
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.sectionAction, { color: colors.accent }]}>
            {action}
          </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <Text style={[styles.sectionLabel, { color: colors.sectionHeader }]}>
      {title.toUpperCase()}
    </Text>
  );
}

export function ProgressRing({
  progress,
  size = 56,
  stroke = 5,
  color,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, progress));
  const offset = c - (pct / 100) * c;
  const ringColor = color ?? colors.green;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={[styles.ringText, { color: colors.text, fontSize: size * 0.22 }]}>
        {Math.round(pct)}%
      </Text>
    </View>
  );
}

export function ProgressBar({
  progress,
  color,
  height = 6,
}: {
  progress: number;
  color?: string;
  height?: number;
}) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.border, height }]}>
      <View
        style={{
          width: `${pct}%`,
          height,
          backgroundColor: color ?? colors.green,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

export function CheckRow({
  label,
  subtitle,
  checked,
  onToggle,
  showDivider = true,
}: {
  label: string;
  subtitle?: string;
  checked: boolean;
  onToggle: () => void;
  showDivider?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.checkRow,
        showDivider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.checkLabel, { color: colors.text }]}>{label}</Text>
        {subtitle ? (
          <Text style={[styles.checkSub, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? colors.checkboxDone : colors.checkbox,
            backgroundColor: checked ? colors.checkboxDone : 'transparent',
          },
        ]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
    </Pressable>
  );
}

export function MenuRow({
  icon,
  label,
  subtitle,
  badge,
  colors: customColors,
  onPress,
  showChevron = true,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  badge?: string | number;
  colors?: ThemeColors;
  onPress?: () => void;
  showChevron?: boolean;
  last?: boolean;
}) {
  const { colors: themeColors } = useTheme();
  const colors = customColors ?? themeColors;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}>
      <View style={[styles.menuIcon, { backgroundColor: colors.cardElevated }]}>
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
        {subtitle ? (
          <Text style={[styles.menuSub, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {badge !== undefined && (
        <View style={[styles.badge, { backgroundColor: colors.red }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

export function QuoteCard({
  text,
  reference,
  icon = 'heart',
  iconColor,
}: {
  text: string;
  reference?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <Card style={styles.quoteCard}>
      <Ionicons name={icon} size={20} color={iconColor ?? colors.green} />
      <Text style={[styles.quoteText, { color: colors.text }]}>{text}</Text>
      {reference ? (
        <Text style={[styles.quoteRef, { color: colors.textMuted }]}>{reference}</Text>
      ) : null}
    </Card>
  );
}

export function TagPill({ label, outline }: { label: string; outline?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.tag,
        outline
          ? { borderWidth: 1, borderColor: colors.tagBorder, backgroundColor: 'transparent' }
          : { backgroundColor: colors.cardElevated },
      ]}>
      <Text style={[styles.tagText, { color: outline ? colors.green : colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

export function DomainGrid({
  areas,
  onPress,
}: {
  areas: readonly {
    route: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    color: string;
  }[];
  onPress: (route: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.domainGrid}>
      {areas.map((area) => (
        <Pressable
          key={area.route}
          onPress={() => onPress(area.route)}
          style={[styles.domainTile, { backgroundColor: colors.card }]}>
          <View style={[styles.domainIcon, { backgroundColor: `${area.color}22` }]}>
            <Ionicons name={area.icon} size={22} color={area.color} />
          </View>
          <Text style={[styles.domainLabel, { color: colors.text }]}>{area.label}</Text>
          {area.subtitle ? (
            <Text style={[styles.domainSub, { color: colors.textMuted }]}>{area.subtitle}</Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionAction: { fontSize: 14, fontWeight: '600' },
  ringText: { position: 'absolute', fontWeight: '700' },
  progressTrack: { borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 12,
  },
  checkLabel: { fontSize: 16, fontWeight: '500' },
  checkSub: { fontSize: 13, marginTop: 2 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  menuSub: { fontSize: 13, marginTop: 2 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 4,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  quoteCard: { gap: 8 },
  quoteText: { fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
  quoteRef: { fontSize: 13, fontWeight: '600' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 13, fontWeight: '600' },
  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  domainTile: {
    width: '47%',
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },
  domainIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  domainLabel: { fontSize: 16, fontWeight: '600' },
  domainSub: { fontSize: 12, marginTop: 2 },
});
