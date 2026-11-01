import * as WebBrowser from 'expo-web-browser';
import { MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities, useL } from '@/content/client';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Chip, EmptyState, Icon, Screen, SectionTitle, Text } from '@/ui';

export function CityScreen({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { data: cities = [] } = useCities();
  const city = cities.find((x) => x.slug === slug);
  const [kind, setKind] = useState('All');
  if (!city) return <Screen title={t('tools.city')} back={{ label: t('guides.title'), href: '/guides' }}><EmptyState icon={MapPin} title="City not found" body="Choose your city in Me › Profile." /></Screen>;
  const kinds = ['All', ...new Set(city.community.map((p) => l(p.kind)))];
  const report = <Text size={13} weight="600" color="primary" onPress={() => void WebBrowser.openBrowserAsync(`mailto:content@settleingermany.app?subject=${encodeURIComponent(`Change: ${city.name}`)}`)}>{t('guides.reportChange')}</Text>;
  return (
    <Screen title={city.name} back={{ label: t('guides.title'), href: '/guides' }} crumbs={[{ label: t('guides.title'), href: '/guides' }, { label: city.name }]}
      description={`Living in ${city.name}: rent, transit, citizen’s office and immigration office appointments, and community places.`}>
      <Text size={13} weight="700" color="primary" uppercase>{t('tools.city')}</Text>
      {city.facts.length ? (
        <Card style={{ gap: 12 }}>
          {city.facts.map((f, i) => (
            <View key={i} style={{ gap: 2 }}>
              <Text size={13} color="muted">{l(f.label)}</Text>
              <Text weight="600">{l(f.value)}</Text>
            </View>
          ))}
        </Card>
      ) : null}
      {city.appointments.length ? (
        <View style={{ gap: 8 }}>
          <SectionTitle>Appointments</SectionTitle>
          {city.appointments.map((a, i) => (
            <Card key={i} style={{ gap: 8 }}>
              <Text weight="700">{l(a.title)}</Text>
              <Text color="text2">{l(a.body)}</Text>
              {a.url ? <Pressable accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(a.url!)} style={{ minHeight: 44, justifyContent: 'center' }}><Text weight="700" color="primary">Book on the city website ↗</Text></Pressable> : null}
              {report}
            </Card>
          ))}
        </View>
      ) : null}
      {city.community.length ? (
        <View style={{ gap: 8 }}>
          <SectionTitle>Community and culture</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{kinds.map((k) => <Chip key={k} label={k} selected={kind === k} onPress={() => setKind(k)} />)}</View>
          {/* TODO: map with pins once a map provider is chosen; list is the accessible fallback. */}
          <Card padded={false} style={{ paddingHorizontal: 16 }}>
            {city.community.filter((p) => kind === 'All' || l(p.kind) === kind).map((p, i) => (
              <View key={p.name} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: i ? 1 : 0, borderColor: c.divider }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}><Text size={13} weight="700" color={c.onPrimary}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}><Text weight="600">{p.name}</Text><Text variant="caption" color="muted">{l(p.kind)}</Text></View>
                <Icon icon={MapPin} size={18} color="muted" />
              </View>
            ))}
          </Card>
          {report}
        </View>
      ) : null}
      <Text variant="caption" color="muted">Last verified on [date] · Sources</Text>
    </Screen>
  );
}
