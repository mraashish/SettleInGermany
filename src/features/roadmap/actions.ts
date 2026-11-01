import { useState } from 'react';

import { roadmapStore, toggleDone } from '@/store/roadmap';
import type { TaskView } from './useRoadmapData';

/** Ticking a task: toggle + remember the last completed task for the celebration banner. */
export function useRoadmapActions() {
  const [lastDone, setLastDone] = useState<string | null>(null);
  const toggle = (v: TaskView, done: boolean) => {
    const isDone = roadmapStore.get().done.includes(v.id);
    if (isDone !== done) toggleDone(v.id);
    setLastDone(done ? v.title : null);
  };
  return { toggle, lastDone };
}
