import { createPersistedStore } from '@/lib/createStore';
import type { StageId } from './prefs';

export interface CustomTask {
  id: string;
  title: string;
  stage: StageId;
  deadline: string | null;
  /** Set when the task was added from a guide: the task page then shows the full guide. */
  guideSlug?: string;
}

interface RoadmapState {
  done: string[];
  hidden: string[];
  custom: CustomTask[];
  savedGuides: string[];
  /** Ticked documents per guide (guide slug → document indexes). */
  docsChecked?: Record<string, number[]>;
}

export const roadmapStore = createPersistedStore<RoadmapState>('roadmap.v1', {
  done: [],
  hidden: [],
  custom: [],
  savedGuides: [],
});
export const useRoadmap = roadmapStore.useStore;

const toggleIn = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export const toggleDone = (id: string) => roadmapStore.set((s) => ({ done: toggleIn(s.done, id) }));
export const toggleHidden = (id: string) => roadmapStore.set((s) => ({ hidden: toggleIn(s.hidden, id) }));
export const toggleSavedGuide = (slug: string) =>
  roadmapStore.set((s) => ({ savedGuides: toggleIn(s.savedGuides, slug) }));
export const addCustomTask = (t: Omit<CustomTask, 'id'>): string => {
  const id = `custom-${Date.now()}`;
  roadmapStore.set((s) => ({ custom: [...s.custom, { ...t, id }] }));
  return id;
};
export const toggleDocChecked = (slug: string, index: number) =>
  roadmapStore.set((s) => {
    const cur = s.docsChecked?.[slug] ?? [];
    const next = cur.includes(index) ? cur.filter((x) => x !== index) : [...cur, index];
    return { docsChecked: { ...(s.docsChecked ?? {}), [slug]: next } };
  });
export const unhide = (id: string) => roadmapStore.set((s) => ({ hidden: s.hidden.filter((x) => x !== id) }));
export const updateCustomTask = (id: string, patch: Partial<Omit<CustomTask, 'id'>>) =>
  roadmapStore.set((s) => ({ custom: s.custom.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
export const deleteCustomTask = (id: string) =>
  roadmapStore.set((s) => ({ custom: s.custom.filter((t) => t.id !== id), done: s.done.filter((x) => x !== id), hidden: s.hidden.filter((x) => x !== id) }));
