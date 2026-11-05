import { router } from 'expo-router';
import { BookOpen, Check, Eye, EyeOff, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useL } from '@/content/client';
import { formatDate } from '@/lib/deadline';
import { deleteCustomTask, toggleHidden, updateCustomTask } from '@/store/roadmap';
import { Button, Card, DueChip, EmptyState, GermanTerm, Screen, Text, TextField } from '@/ui';
import { parseDate } from '../reminders/dates';
import { useRoadmapActions } from './actions';
import { stageIndex, useRoadmapData } from './useRoadmapData';

/** One page per roadmap item (tasks without a guide, and the user's own tasks). */
export function TaskScreen({ id }: { id: string }) {
  const { t, i18n } = useTranslation();
  const l = useL();
  const { byStage } = useRoadmapData();
  const { toggle } = useRoadmapActions();
  const v = Object.values(byStage).flat().find((x) => x.id === id);
  const [deadline, setDeadline] = useState(v?.task.deadlineDate ? v.task.deadlineDate.split('-').reverse().join('.') : '');
  const [title, setTitle] = useState(v?.title ?? '');

  if (!v) {
    return (
      <Screen title={t('roadmap.title')} back={{ label: t('roadmap.title'), href: '/roadmap/first30' }} large={false}>
        <EmptyState title={t('roadmap.taskMissing')} body={t('roadmap.taskMissingBody')} actionLabel={t('roadmap.title')} onAction={() => router.replace('/roadmap/first30')} />
      </Screen>
    );
  }
  const done = v.state === 'done';
  const hidden = v.state === 'hidden';
  const back = { label: t('roadmap.title'), href: `/roadmap/${v.task.stage}` };

  return (
    <Screen title={v.title} back={back} large={false}
      crumbs={[{ label: t('roadmap.title'), href: `/roadmap/${v.task.stage}` }, { label: v.title }]}>
      <Text size={13} weight="700" color="primary" uppercase>
        {t('guides.stageLabel', { n: stageIndex(v.task.stage), stage: t(`stages.${v.task.stage}`) })} · {v.group}
      </Text>
      <Text size={26} lineHeight={32} weight="700" heading={1}>{v.title}</Text>
      {v.task.term ? <GermanTerm term={v.task.term} audio /> : null}
      <Card style={{ gap: 10 }}>
        {v.due ? (
          <View style={{ gap: 6 }}>
            <Text size={13} color="muted">{t('guides.deadline')}</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Text weight="700">{formatDate(v.due, i18n.language, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
              <DueChip due={v.due} done={done} />
            </View>
            {v.task.deadlineDaysAfterArrival ? <Text variant="caption" color="muted">{t('roadmap.countedFromArrival', { count: v.task.deadlineDaysAfterArrival })}</Text> : null}
          </View>
        ) : v.task.deadlineDaysAfterArrival ? (
          <Text color="text2">{t('roadmap.addArrivalForDeadline', { count: v.task.deadlineDaysAfterArrival })}</Text>
        ) : (
          <Text color="text2">{l(v.task.timingNote) || t('roadmap.noDeadline')}</Text>
        )}
        {v.task.effort ? <Text variant="caption" color="muted">{t('roadmap.effort', { effort: l(v.task.effort) })}</Text> : null}
      </Card>

      <Button icon={Check} label={done ? t('roadmap.markNotDone') : t('roadmap.markDone')} variant={done ? 'secondary' : 'primary'} onPress={() => toggle(v, !done)} />
      {v.guideHref ? <Button variant="secondary" icon={BookOpen} label={t('roadmap.readGuide')} onPress={() => router.push(v.guideHref as never)} /> : null}

      {v.custom ? (
        <Card style={{ gap: 12 }}>
          <TextField label={t('roadmap.newTaskTitle')} value={title} onChangeText={setTitle} />
          <TextField label={t('reminders.date')} value={deadline} onChangeText={setDeadline} placeholder="15.01.2027" hint={t('reminders.dateHint')} keyboardType="numbers-and-punctuation" />
          <Button label={t('nav.save')} onPress={() => {
            updateCustomTask(v.id, { title: title.trim() || v.title, deadline: parseDate(deadline) });
            router.back();
          }} />
          <Button variant="destructive" icon={Trash2} label={t('roadmap.deleteTask')} onPress={() => { deleteCustomTask(v.id); router.replace(back.href as never); }} />
        </Card>
      ) : (
        <Button variant="text" icon={hidden ? Eye : EyeOff} label={hidden ? t('roadmap.unhide') : t('roadmap.hide')} onPress={() => toggleHidden(v.id)} />
      )}
    </Screen>
  );
}
