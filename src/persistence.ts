import type { Draft } from "./components/setup/draftTypes";
import type { Tournament, TournamentFormat } from "./tournament/types";

// Bump this whenever the Draft/Tournament shape changes in a
// backwards-incompatible way, so old localStorage data is cleanly ignored
// instead of crashing the app on load (see ErrorBoundary.tsx for the
// last-resort safety net if that ever happens anyway).
const STORAGE_KEY = "bracket-app:state-v2";

export type PersistedState = {
  activeFormat: TournamentFormat;
  tournaments: Partial<Record<TournamentFormat, Tournament>>;
  drafts: Partial<Record<TournamentFormat, Draft>>;
};

export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return parsed as PersistedState;
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors, private-browsing restrictions, etc. -- persistence
    // is a nice-to-have, not something that should ever break the app.
  }
}
