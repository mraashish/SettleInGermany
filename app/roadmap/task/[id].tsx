import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { staticCollection } from '@/content/client';
import { TaskScreen } from '@/features/roadmap/TaskScreen';
import { pageMetadata } from '@/lib/metadata';

export async function generateStaticParams() {
  return (await staticCollection('tasks')).map((t) => ({ id: t.id }));
}

export function generateMetadata() {
  return pageMetadata({ title: 'Roadmap', path: '/roadmap/first30', noindex: true });
}

export default function TaskRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TaskScreen id={id} />;
}
