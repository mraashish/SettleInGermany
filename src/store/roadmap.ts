import { createPersistedStore } from '@/lib/createStore';
import type { StageId } from './prefs';

export interface CustomTask {
  id: string;
  title: string;
  stage: StageId;
  deadline: string | null;
}

interface RoadmapState {
  done: string[];
  hidden: string[];
  custom: CustomTask[];
  savedGuides: string[];
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
export const addCustomTask = (t: Omit<CustomTask, 'id'>) =>
  roadmapStore.set((s) => ({ custom: [...s.custom, { ...t, id: `custom-${Date.now()}` }] }));
export const updateCustomTask = (id: string, patch: Partial<Omit<CustomTask, 'id'>>) =>
  roadmapStore.set((s) => ({ custom: s.custom.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
export const deleteCustomTask = (id: string) =>
  roadmapStore.set((s) => ({ custom: s.custom.filter((t) => t.id !== id), done: s.done.filter((x) => x !== id), hidden: s.hidden.filter((x) => x !== id) }));
