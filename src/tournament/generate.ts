import type {
  DoubleElimConfig,
  DoubleElimTournament,
  GroupKnockoutConfig,
  GroupKnockoutTournament,
  SeriesConfig,
  SeriesTournament,
  SingleElimConfig,
  SingleElimTournament,
  Tournament,
  TournamentConfig,
} from "./types";
import { generateGroupKnockout } from "./formats/groupKnockout";
import { generateSeriesBracket } from "./formats/seriesBracket";
import { generateSingleElim } from "./formats/singleElim";
import { generateDoubleElim } from "./formats/doubleElim";

export function generateTournament(
  config: SingleElimConfig,
): SingleElimTournament;
export function generateTournament(config: SeriesConfig): SeriesTournament;
export function generateTournament(
  config: GroupKnockoutConfig,
): GroupKnockoutTournament;
export function generateTournament(
  config: DoubleElimConfig,
): DoubleElimTournament;
export function generateTournament(config: TournamentConfig): Tournament;
export function generateTournament(config: TournamentConfig): Tournament {
  switch (config.format) {
    case "single-elim":
      return generateSingleElim(config);
    case "series-bracket":
      return generateSeriesBracket(config);
    case "group-knockout":
      return generateGroupKnockout(config);
    case "double-elim":
      return generateDoubleElim(config);
  }
}
