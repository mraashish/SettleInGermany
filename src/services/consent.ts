import { createPersistedStore } from '@/lib/createStore';

/**
 * Consent UI state. The decision itself lives in prefs.consent. The consent modal
 * (Consent / WebConsent design) is rendered by <ConsentHost/> in the root layout on
 * first launch / first web visit — before any personalised ads or analytics.
 */
const ui = createPersistedStore<{ settingsOpen: boolean }>('consent-ui.v1', { settingsOpen: false });

export const useConsentUi = ui.useStore;
export const openConsentSettings = () => ui.set({ settingsOpen: true });
export const closeConsentSettings = () => ui.set({ settingsOpen: false });
