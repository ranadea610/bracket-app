export type TournamentFormat = "single-elim" | "series-bracket" | "group-knockout";

export type Participant = {
  id: string;
  name: string;
  seed?: number;
};

export type Game = {
  winner?: Participant;
};

export type Match = {
  id: string;
  participant1?: Participant;
  participant2?: Participant;
  winner?: Participant;
  // Only populated for series-bracket matches
  bestOf?: number;
  games?: Game[];
};

export type Round = {
  roundNumber: number;
  name?: string;
  matches: Match[];
};

export type EliminationBracket = {
  rounds: Round[];
};

export type GroupStanding = {
  participant: Participant;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
};

export type Group = {
  id: string;
  name: string;
  participants: Participant[];
  matches: Match[];
  standings: GroupStanding[];
};

export type GroupStage = {
  groups: Group[];
  advancePerGroup: number;
};

export type TournamentBase = {
  id: string;
  name: string;
  createdAt: string;
};

export type SingleElimTournament = TournamentBase & {
  format: "single-elim";
  bracket: EliminationBracket;
};

export type SeriesTournament = TournamentBase & {
  format: "series-bracket";
  bracket: EliminationBracket;
};

export type GroupKnockoutTournament = TournamentBase & {
  format: "group-knockout";
  groupStage: GroupStage;
  knockout: EliminationBracket | null;
};

export type Tournament =
  | SingleElimTournament
  | SeriesTournament
  | GroupKnockoutTournament;

export type BaseConfig = {
  name: string;
  participants: string[];
};

export type SingleElimConfig = BaseConfig & {
  format: "single-elim";
};

export type SeriesConfig = BaseConfig & {
  format: "series-bracket";
  bestOf: number;
};

export type GroupKnockoutConfig = BaseConfig & {
  format: "group-knockout";
  groupSize: number;
  advancePerGroup: number;
};

export type TournamentConfig =
  | SingleElimConfig
  | SeriesConfig
  | GroupKnockoutConfig;
