import * as WebBrowser from 'expo-web-browser';
import { Check, Minus } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useL } from '@/content/client';
import type { Provider } from '@/content/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Pill } from './Chip';
import { Icon } from './Icon';
import { Text } from './Text';

export interface ProviderRow { label: string; value: string; kind?: 'placeholder' | 'yes' | 'no' | 'text' }

const isPlaceholder = (v: string) => v.includes('[');

export function rowsFor(p: Provider, t: (k: string) => string): ProviderRow[] {
  return [
    ...(p.setupFee ? [{ label: 'Setup fee', value: p.setupFee }] : []),
    { label: t('tools.monthlyFee'), value: p.monthlyFee },
    { label: t('tools.openingTime'), value: p.openingTime },
    ...(p.payout ? [{ label: t('tools.payout'), value: p.payout }] : []),
  ];
}

function Value({ row }: { row: ProviderRow }) {
  const { c } = useTheme();
  const kind = row.kind ?? (isPlaceholder(row.value) ? 'placeholder' : 'text');
  if (kind === 'yes' || kind === 'no') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Icon icon={kind === 'yes' ? Check : Minus} size={16} color={kind === 'yes' ? 'successText' : 'muted'} />
        <Text size={13} weight={kind === 'yes' ? '600' : '500'} color={kind === 'yes' ? 'successText' : 'muted'}>{row.value}</Text>
      </View>
    );
  }
  return (
    <Text
      size={13}
      weight="600"
      color={kind === 'placeholder' ? 'warningText' : 'text'}
      style={kind === 'placeholder' ? { backgroundColor: c.warningBg, paddingHorizontal: 4, borderRadius: 4, alignSelf: 'flex-start' } : undefined}
    >
      {row.value}
    </Text>
  );
}

export function openProvider(p: Provider) {
  void WebBrowser.openBrowserAsync(p.referralUrl ?? p.url);
}

/** ProviderCard: default, highlighted, referral (ComparePage). */
export function ProviderCard({ provider, highlighted, badge }: { provider: Provider; highlighted?: boolean; badge?: string }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const rows = rowsFor(provider, t);
  return (
    <View
      accessibilityRole={'article' as never}
      style={{ borderWidth: highlighted ? 2 : 1, borderColor: highlighted ? c.primary : c.border, borderRadius: th.shape.card, backgroundColor: c.surface, padding: highlighted ? 15 : 16, gap: 10 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: c.divider, alignItems: 'center', justifyContent: 'center' }}>
          <Text size={10} color="muted">Logo</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text size={16} weight="700">{provider.name}</Text>
          {provider.facts[0] ? <Text variant="caption" color="muted">{l(provider.facts[0])}</Text> : null}
        </View>
        {badge ? <Pill label={badge} tone="tint" /> : null}
      </View>
      <View style={{ gap: 6 }}>
        {rows.map((r) => (
          <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text size={13} color="text3" style={{ flex: 1 }}>{r.label}</Text>
            <Value row={r} />
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="link"
        accessibilityHint={provider.referralUrl ? t('common.referral') : undefined}
        onPress={() => openProvider(provider)}
        style={{
          minHeight: 44, borderRadius: th.shape.button, borderWidth: 1.5, borderColor: c.primary,
          backgroundColor: highlighted ? c.primary : c.surface, alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text size={14} weight="700" color={highlighted ? c.onPrimary : c.primary}>{t('tools.visit')}</Text>
      </Pressable>
      <Text size={11} lineHeight={15} color="muted">
        {provider.referralUrl ? t('common.referral') : 'Not a partner — listed because it fits your needs.'}
      </Text>
    </View>
  );
}

/** Desktop web: comparison table (WebCompare). */
export function ProviderTable({ providers }: { providers: Provider[] }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const rowLabels = providers[0] ? rowsFor(providers[0], t).map((r) => r.label) : [];
  const col = { flex: 1, minWidth: 140, paddingVertical: 12, paddingHorizontal: 12 } as const;
  return (
    <View accessibilityRole={'table' as never} style={{ borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.surface, overflow: 'hidden' }}>
      <View accessibilityRole={'row' as never} style={{ flexDirection: 'row', backgroundColor: c.ground, borderBottomWidth: 1, borderColor: c.border }}>
        <View style={[col, { flex: 0.8 }]} />
        {providers.map((p, i) => (
          <View key={p.id} accessibilityRole={'columnheader' as never} style={[col, { gap: 4 }]}>
            <Text weight="700">{p.name}</Text>
            {p.facts[0] ? <Text variant="caption" color="muted">{l(p.facts[0])}</Text> : null}
            {i === 0 ? <Pill label={t('tools.sortFees')} /> : null}
          </View>
        ))}
      </View>
      {rowLabels.map((label, ri) => (
        <View key={label} accessibilityRole={'row' as never} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: c.divider }}>
          <View style={[col, { flex: 0.8 }]}><Text size={14} color="text3">{label}</Text></View>
          {providers.map((p) => (
            <View key={p.id} accessibilityRole={'cell' as never} style={col}><Value row={rowsFor(p, t)[ri]} /></View>
          ))}
        </View>
      ))}
      <View style={{ flexDirection: 'row' }}>
        <View style={[col, { flex: 0.8 }]} />
        {providers.map((p, i) => (
          <View key={p.id} style={[col, { gap: 6 }]}>
            <Pressable accessibilityRole="link" onPress={() => openProvider(p)} style={{ minHeight: 44, borderRadius: 12, borderWidth: 1.5, borderColor: c.primary, backgroundColor: i === 0 ? c.primary : c.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text size={14} weight="700" color={i === 0 ? c.onPrimary : c.primary}>{t('tools.visit')}</Text>
            </Pressable>
            <Text size={11} color="muted">{p.referralUrl ? t('common.referral') : 'Not a partner.'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
