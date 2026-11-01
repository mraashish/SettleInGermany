import { useMemo } from 'react';

import { useL, useTasks } from '@/content/client';
import type { RoadmapTask } from '@/content/types';
import { daysUntil, taskDueDate } from '@/lib/deadline';
import { STAGES, type StageId, usePrefs } from '@/store/prefs';
import { useRoadmap } from '@/store/roadmap';
import type { TaskState } from '@/ui/TaskItem';

export interface TaskView {
  task: RoadmapTask;
  id: string;
  title: string;
  group: string;
  due: string | null;
  state: TaskState;
  custom?: boolean;
}

/** Rough effort per task for "about N hours left" (until the CMS carries minutes). */
const HOURS_PER_TASK = 1.2;

export function useRoadmapData(stage?: StageId) {
  const { data: tasks = [] } = useTasks();
  const profile = usePrefs((s) => s.profile);
  const { done, hidden, custom } = useRoadmap();
  const l = useL();

  return useMemo(() => {
    const all: RoadmapTask[] = [
      ...tasks.filter((t) => !t.statuses?.length || (profile.status && t.statuses.includes(profile.status))),
      ...custom.map((c): RoadmapTask => ({ id: c.id, stage: c.stage, group: { en: 'My tasks' }, title: { en: c.title }, deadlineDate: c.deadline ?? undefined })),
    ];
    const view = (t: RoadmapTask): TaskView => {
      const due = taskDueDate(t, profile.arrivalDate);
      const isDone = done.includes(t.id);
      const isHidden = hidden.includes(t.id);
      const state: TaskState = isDone ? 'done' : isHidden ? 'hidden' : due && daysUntil(due) < 0 ? 'overdue' : 'open';
      return { task: t, id: t.id, title: l(t.title), group: l(t.group), due, state, custom: t.id.startsWith('custom-') };
    };
    const byStage = Object.fromEntries(STAGES.map((s) => [s, all.filter((t) => t.stage === s).map(view)])) as Record<StageId, TaskView[]>;
    const stats = (s: StageId) => {
      const list = byStage[s].filter((v) => v.state !== 'hidden');
      const d = list.filter((v) => v.state === 'done').length;
      return { done: d, total: list.length, left: list.length - d, hours: Math.max(0, Math.round((list.length - d) * HOURS_PER_TASK)) };
    };
    const current = stage ?? profile.stage;
    const open = byStage[current]
      .filter((v) => v.state === 'open' || v.state === 'overdue')
      .sort((a, b) => (a.due ? daysUntil(a.due) : 9999) - (b.due ? daysUntil(b.due) : 9999));
    const deadlines = STAGES.flatMap((s) => byStage[s])
      .filter((v) => v.due && v.state !== 'done' && v.state !== 'hidden')
      .sort((a, b) => daysUntil(a.due!) - daysUntil(b.due!));
    return { byStage, stats, current, next3: open.slice(0, 3), deadlines };
  }, [tasks, profile, done, hidden, custom, l, stage]);
}

export const stageIndex = (s: StageId) => STAGES.indexOf(s) + 1;
