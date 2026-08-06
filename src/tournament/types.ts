export type TournamentFormat =
  | "single-elim"
  | "series-bracket"
  | "group-knockout"
  | "double-elim";

export type Participant = {
  id: string;
  name: string;
  seed?: number;
};

export type Match = {
  id: string;
  participant1?: Participant;
  participant2?: Participant;
  winner?: Participant;
  score?: { participant1: number; participant2: number };
  // Only populated for series-bracket matches
  bestOf?: number;
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
  goalsFor: number;
  goalsAgainst: number;
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
  // World Cup-style: this many additional advancers, ranked across all
  // groups' 3rd-place finishers, on top of advancePerGroup per group.
  thirdPlaceAdvancers?: number;
};

export type TournamentBase = {
  id: string;
  name: string;
  description?: string;
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

export type DoubleElimTournament = TournamentBase & {
  format: "double-elim";
  winnersBracket: EliminationBracket;
  losersBracket: EliminationBracket;
  grandFinals: EliminationBracket;
};

export type Tournament =
  | SingleElimTournament
  | SeriesTournament
  | GroupKnockoutTournament
  | DoubleElimTournament;

export type BaseConfig = {
  name: string;
  description?: string;
  participants: string[];
};

export type DefaultSingleElimConfig = BaseConfig & {
  format: "single-elim";
  bracketFormat: "default";
};

export type MarchMadnessConfig = BaseConfig & {
  format: "single-elim";
  bracketFormat: "march-madness";
};

export type SingleElimConfig = DefaultSingleElimConfig | MarchMadnessConfig;

export type DefaultSeriesConfig = BaseConfig & {
  format: "series-bracket";
  seriesFormat: "default";
  bestOf: number;
};

export type NbaPlayoffsConfig = BaseConfig & {
  format: "series-bracket";
  seriesFormat: "nba-playoffs";
};

export type WttSeriesFormat =
  | "wtt-star-contender"
  | "wtt-champions"
  | "wtt-grand-smash";

export type WttSeriesConfig = BaseConfig & {
  format: "series-bracket";
  seriesFormat: WttSeriesFormat;
};

export type SeriesConfig =
  | DefaultSeriesConfig
  | NbaPlayoffsConfig
  | WttSeriesConfig;

export type DefaultGroupKnockoutConfig = BaseConfig & {
  format: "group-knockout";
  groupFormat: "default";
  groupSize: number;
  advancePerGroup: number;
};

export type WorldCupConfig = BaseConfig & {
  format: "group-knockout";
  groupFormat: "world-cup";
};

export type GroupKnockoutConfig = DefaultGroupKnockoutConfig | WorldCupConfig;

export type DoubleElimConfig = BaseConfig & {
  format: "double-elim";
};

export type TournamentConfig =
  | SingleElimConfig
  | SeriesConfig
  | GroupKnockoutConfig
  | DoubleElimConfig;
