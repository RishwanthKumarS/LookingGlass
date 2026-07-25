import { getSetting, setSetting } from '../db/queries/settings';

export interface TrialState {
  usedSeconds: number;
  activeSince: string | null;
  purchased: boolean;
}

function loadState(themeId: string): TrialState {
  const raw = getSetting(`trial:${themeId}`);
  if (!raw) return { usedSeconds: 0, activeSince: null, purchased: false };
  return JSON.parse(raw);
}

function saveState(themeId: string, state: TrialState) {
  setSetting(`trial:${themeId}`, JSON.stringify(state));
}

export function getTrialState(themeId: string): TrialState {
  return loadState(themeId);
}

export function hasStartedTrial(themeId: string): boolean {
  const state = loadState(themeId);
  return state.usedSeconds > 0 || state.activeSince !== null || state.purchased;
}

export function getRemainingSeconds(themeId: string, trialHours: number): number {
  const state = loadState(themeId);
  if (state.purchased) return Infinity;
  let used = state.usedSeconds;
  if (state.activeSince) {
    used += Math.floor((Date.now() - new Date(state.activeSince).getTime()) / 1000);
  }
  return Math.max(0, trialHours * 3600 - used);
}

export function startTrial(themeId: string) {
  const state = loadState(themeId);
  state.activeSince = new Date().toISOString();
  saveState(themeId, state);
}

export function resumeTrial(themeId: string) {
  const state = loadState(themeId);
  if (!state.purchased) {
    state.activeSince = new Date().toISOString();
    saveState(themeId, state);
  }
}

export function pauseTrial(themeId: string) {
  const state = loadState(themeId);
  if (state.activeSince) {
    const elapsed = Math.floor((Date.now() - new Date(state.activeSince).getTime()) / 1000);
    state.usedSeconds += elapsed;
    state.activeSince = null;
    saveState(themeId, state);
  }
}

export function markPurchased(themeId: string) {
  const state = loadState(themeId);
  state.purchased = true;
  state.activeSince = null;
  saveState(themeId, state);
}