import { Check, MapPin, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCities } from '@/content/client';
import { citySlug, GERMAN_CITIES } from '@/content/germanCities';
import { setProfile, usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { Icon, SelectCard, Text } from '@/ui';

/** Onboarding step 4: any German city can be chosen or typed; the choice is saved immediately. */
export function CityStep() {
  const { t } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const city = usePrefs((s) => s.profile.city);
  const cityName = usePrefs((s) => s.profile.cityName);
  const { data: pages = [] } = useCities();
  const [q, setQ] = useState('');
  const withGuide = pages.filter((p) => p.facts.length || p.appointments.length);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const names = new Set([...withGuide.map((p) => p.name), ...GERMAN_CITIES]);
    return [...names].filter((n) => !query || n.toLowerCase().includes(query)).slice(0, query ? 40 : 12);
  }, [q, withGuide]);
  const exact = list.some((n) => n.toLowerCase() === q.trim().toLowerCase());
  const pick = (name: string) => setProfile({ city: citySlug(name), cityName: name });
  const selectedName = city && city !== 'undecided' ? (withGuide.find((p) => p.slug === city)?.name ?? cityName ?? city) : null;

  return (
    <View style={{ gap: 12 }}>
      {selectedName ? (
        <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: c.successBg, borderRadius: 12, padding: 12 }}>
          <Icon icon={Check} size={18} color="successText" />
          <Text weight="600" color="successText" style={{ flex: 1 }}>{t('onboarding.citySaved', { city: selectedName })}</Text>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, borderRadius: th.shape.field, borderWidth: 1, borderColor: c.fieldBorder, backgroundColor: c.surface, paddingHorizontal: 12 }}>
        <Icon icon={Search} size={20} color="muted" />
        <TextInput value={q} onChangeText={setQ} placeholder={t('onboarding.searchCities')} placeholderTextColor={c.muted} accessibilityLabel={t('onboarding.searchCities')}
          autoCorrect={false} style={{ flex: 1, fontFamily: fonts.regular, fontSize: 16, color: c.text, minHeight: 44 }} />
      </View>
      <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
        {list.map((name) => {
          const slug = citySlug(name);
          const hasGuide = withGuide.some((p) => p.slug === slug);
          return <SelectCard key={slug} title={name} sub={hasGuide ? t('onboarding.cityGuideAvailable') : undefined} selected={city === slug} onPress={() => pick(name)} />;
        })}
        {q.trim().length > 1 && !exact ? (
          <Pressable accessibilityRole="button" onPress={() => pick(q.trim())}
            style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: c.primary, paddingHorizontal: 16 }}>
            <Icon icon={MapPin} color="primary" />
            <Text weight="600" color="primary">{t('onboarding.useCity', { city: q.trim() })}</Text>
          </Pressable>
        ) : null}
        <SelectCard title={t('onboarding.undecided')} selected={city === 'undecided'} onPress={() => setProfile({ city: 'undecided', cityName: null })} />
      </View>
    </View>
  );
}
