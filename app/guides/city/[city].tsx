import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { fetchCollection } from '@/content/client';
import { pageMetadata } from '@/lib/metadata';
import { CityScreen } from '@/features/guides/CityScreen';

export async function generateStaticParams() {
  return (await fetchCollection('cities')).map((c) => ({ city: c.slug }));
}

export async function generateMetadata(_req: unknown, params: { city?: string }) {
  const c = (await fetchCollection('cities')).find((x) => x.slug === params?.city);
  return pageMetadata({ title: `Living in ${c?.name ?? 'your city'}`, description: `Rent, transit, appointments and community places in ${c?.name ?? 'your city'}.`, path: `/guides/city/${params?.city ?? ''}` });
}

export default function CityRoute() {
  const { city } = useLocalSearchParams<{ city: string }>();
  return <CityScreen slug={city} />;
}
