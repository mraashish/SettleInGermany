import { router } from 'expo-router';
import { MoreHorizontal, PartyPopper, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useL } from '@/content/client';
import { formatDate } from '@/lib/deadline';
import { STAGES, type StageId } from '@/store/prefs';
import { addCustomTask, toggleHidden } from '@/store/roadmap';
import { useTheme } from '@/theme/ThemeProvider';
import { Button, Icon, Overline, ProgressRing, Screen, Sheet, StageSwitcher, TaskItem, Text, TextField } from '@/ui';
import { useRoadmapActions } from './actions';
import { useRoadmapData } from './useRoadmapData';

export function RoadmapScreen({ stage }: { stage: StageId }) {
  const { t, i18n } = useTranslation();
  const th = useTheme();
  const { c } = th;
  const l = useL();
  const { byStage, stats } = useRoadmapData(stage);
  const { toggle, lastDone } = useRoadmapActions();
  const [showHidden, setShowHidden] = useState(false);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const s = stats(stage);
  const list = byStage[stage];
  const hiddenCount = list.filter((v) => v.state === 'hidden').length;
  const groups = [...new Set(list.map((v) => v.group))];

  const switcher = (
    <StageSwitcher<StageId>
      label={t('roadmap.stages')}
      value={stage}
      onChange={(id) => router.setParams({ stage: id })}
      options={STAGES.map((id) => ({ id, label: t(`stages.short${id === 'first30' ? 'First30' : id.charAt(0).toUpperCase() + id.slice(1)}`) }))}
    />
  );

  return (
    <Screen
      title={t('roadmap.title')}
      large={false}
      back={{ label: t('nav.home'), href: '/' }}
      actions={[{ icon: MoreHorizontal, label: t('nav.more'), onPress: () => setShowHidden((v) => !v) }]}
      headerBelow={switcher}
      crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('roadmap.title') }]}
      hideWebTitle
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <ProgressRing value={s.done} total={s.total} size={56} label={`${s.done} / ${s.total}`} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text size={24} lineHeight={30} weight="700" heading={1}>{t(`stages.${stage}`)}</Text>
          <Text size={14} color="muted">{t('roadmap.toGo', { count: s.left, hours: s.hours })}</Text>
        </View>
      </View>

      {lastDone ? (
        <View accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: th.scheme === 'dark' ? '#33291A' : '#FBEFD9', borderWidth: 1, borderColor: c.accent, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }}>
          <Icon icon={PartyPopper} size={20} color="warningBorder" />
          <Text size={14} weight="600" color="warningStrongText" style={{ flex: 1 }}>{t('roadmap.celebrate', { task: lastDone, done: s.done, total: s.total })}</Text>
        </View>
      ) : null}

      {groups.map((g) => {
        const items = list.filter((v) => v.group === g && (showHidden || v.state !== 'hidden'));
        if (!items.length) return null;
        const gDone = items.filter((v) => v.state === 'done').length;
        return (
          <View key={g} style={{ gap: 8 }}>
            <Overline>{t('roadmap.groupProgress', { group: g, done: gDone, total: items.length })}</Overline>
            <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: th.shape.card, paddingHorizontal: 16 }}>
              {items.map((v, i) => (
                <TaskItem
                  key={v.id}
                  first={i === 0}
                  title={v.title}
                  term={v.task.term}
                  effort={l(v.task.effort) || (v.task.timingNote ? l(v.task.timingNote).toLowerCase() : v.due ? undefined : t('deadline.noDeadline'))}
                  due={v.due}
                  state={v.state}
                  doneLabel={v.state === 'done' ? t('roadmap.doneOn', { date: lastDone === v.title ? t('roadmap.justNow') : formatDate(new Date(), i18n.language, { day: 'numeric', month: 'short' }) }) : undefined}
                  href={v.href}
                  onToggle={(d) => toggle(v, d)}
                  onHide={() => toggleHidden(v.id)}
                />
              ))}
            </View>
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        {hiddenCount ? (
          <Button variant="text" fullWidth={false} label={showHidden ? t('roadmap.hiddenHide') : t('roadmap.hiddenShow', { count: hiddenCount })} onPress={() => setShowHidden((v) => !v)} />
        ) : <View />}
        <Button variant="secondary" fullWidth={false} icon={Plus} label={t('roadmap.addOwn')} onPress={() => setAdding(true)} />
      </View>

      <Sheet visible={adding} title={t('roadmap.addOwn')} onClose={() => setAdding(false)} onSave={() => {
        if (title.trim()) addCustomTask({ title: title.trim(), stage, deadline: null });
        setTitle('');
        setAdding(false);
      }}>
        <TextField label={t('roadmap.newTaskTitle')} value={title} onChangeText={setTitle} autoFocus />
      </Sheet>
    </Screen>
  );
}
