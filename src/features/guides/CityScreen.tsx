import * as WebBrowser from 'expo-web-browser';
import { MapPin, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities, useL } from '@/content/client';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Chip, EmptyState, Icon, Screen, SectionTitle, SourcesList, Text } from '@/ui';

export function CityScreen({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { data: cities = [] } = useCities();
  const city = cities.find((x) => x.slug === slug);
  const [kind, setKind] = useState<string>('all');
  const back = { label: t('guides.title'), href: '/guides' };
  if (!city || (!city.facts.length && !city.appointments.length)) {
    return (
      <Screen title={city?.name ?? t('tools.city')} back={back}>
        <EmptyState icon={MapPin} title={t('city.noPage', { city: city?.name ?? '' })} body={t('city.noPageBody')} />
      </Screen>
    );
  }
  const kinds = [...new Set(city.community.map((p) => p.kind.en))];
  const report = (
    <Text size={13} weight="600" color="primary" onPress={() => void Linking.openURL(`mailto:content@settleingermany.app?subject=${encodeURIComponent(`Change: ${city.name}`)}`)}>
      {t('guides.reportChange')}
    </Text>
  );
  const link = (url: string, label: string) => (
    <Pressable accessibilityRole="link" onPress={() => void WebBrowser.openBrowserAsync(url)} style={{ minHeight: 44, justifyContent: 'center' }}>
      <Text weight="700" color="primary">{label} ↗</Text>
    </Pressable>
  );
  return (
    <Screen title={city.name} back={back} crumbs={[{ label: t('guides.title'), href: '/guides' }, { label: city.name }]}
      description={t('city.description', { city: city.name })}>
      <Text size={13} weight="700" color="primary" uppercase>{t('tools.city')}</Text>
      <Card style={{ gap: 12 }}>
        {city.facts.map((f, i) => (
          <View key={i} style={{ gap: 2, borderTopWidth: i ? 1 : 0, borderColor: c.divider, paddingTop: i ? 10 : 0 }}>
            <Text size={13} color="muted">{l(f.label)}</Text>
            <Text weight="600">{l(f.value)}</Text>
          </View>
        ))}
      </Card>
      {city.appointments.length ? (
        <View style={{ gap: 8 }}>
          <SectionTitle>{t('city.appointments')}</SectionTitle>
          {city.appointments.map((a, i) => (
            <Card key={i} style={{ gap: 8 }}>
              <Text weight="700">{l(a.title)}</Text>
              <Text color="text2">{l(a.body)}</Text>
              {a.url ? link(a.url, t('city.bookOnline')) : null}
              {report}
            </Card>
          ))}
        </View>
      ) : null}
      {city.community.length ? (
        <View style={{ gap: 8 }}>
          <SectionTitle>{t('city.community')}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Chip label={t('guides.all')} selected={kind === 'all'} onPress={() => setKind('all')} />
            {kinds.map((k) => <Chip key={k} label={l(city.community.find((p) => p.kind.en === k)?.kind)} selected={kind === k} onPress={() => setKind(k)} />)}
          </View>
          {city.community.filter((p) => kind === 'all' || p.kind.en === kind).map((p) => (
            <Card key={p.name} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Icon icon={MapPin} size={18} color="primary" />
                <Text weight="700" style={{ flex: 1 }}>{p.name}</Text>
                <Text size={12} color="muted">{l(p.kind)}</Text>
              </View>
              {p.description ? <Text size={14} color="text2">{l(p.description)}</Text> : null}
              {p.address ? <Text size={14} color="text2">{p.address}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                {p.phone ? (
                  <Pressable accessibilityRole="button" onPress={() => void Linking.openURL(`tel:${p.phone!.replace(/[^\d+]/g, '')}`)} style={{ minHeight: 44, flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <Icon icon={Phone} size={16} color="primary" /><Text weight="600" color="primary">{p.phone}</Text>
                  </Pressable>
                ) : null}
                {p.url ? link(p.url, t('common.website')) : null}
                {p.mapUrl ? link(p.mapUrl, t('city.map')) : null}
              </View>
            </Card>
          ))}
          {report}
        </View>
      ) : null}
      <SourcesList sources={city.sources} lastVerified={city.lastVerified} />
    </Screen>
  );
}
