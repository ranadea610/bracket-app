import type { Tournament, TournamentFormat } from "../tournament/types";

export type SavedBracket = {
  id: string;
  name: string;
  format: TournamentFormat;
  tournament: Tournament;
  updatedAt: string;
};
