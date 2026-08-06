import type {
  Participant,
  SeriesConfig,
  SeriesTournament,
  WttSeriesFormat,
} from "../types";
import {
  buildEliminationRounds,
  buildEliminationRoundsWithByes,
  toParticipants,
  withRoundNames,
} from "./shared";
import { reseedForBracket } from "./seeding";
import { propagateAdvancement } from "../advance";

const NBA_PLAYOFFS_ROUND_NAMES = [
  "First Round",
  "Conference Semifinals",
  "Conference Finals",
  "NBA Finals",
];

const CONFERENCE_SIZE = 8;

/** Reseeds East and West independently, then concatenates East + West. */
function seedNbaPlayoffsField(participants: Participant[]): Participant[] {
  const east = reseedForBracket(participants.slice(0, CONFERENCE_SIZE));
  const west = reseedForBracket(participants.slice(CONFERENCE_SIZE, CONFERENCE_SIZE * 2));
  return [...east, ...west];
}

const ROUND_OF_64_NAMES = [
  "Round of 64",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];
const ROUND_OF_32_NAMES = [
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

// Real draw size (players who actually enter the draw) vs. bracket size
// (the next power of 2 -- extra slots become byes for the top seeds).
const WTT_DRAW_SIZE: Record<WttSeriesFormat, number> = {
  "wtt-star-contender": 48,
  "wtt-champions": 32,
  "wtt-grand-smash": 64,
};
const WTT_BRACKET_SIZE: Record<WttSeriesFormat, number> = {
  "wtt-star-contender": 64,
  "wtt-champions": 32,
  "wtt-grand-smash": 64,
};
const WTT_ROUND_NAMES: Record<WttSeriesFormat, string[]> = {
  "wtt-star-contender": ROUND_OF_64_NAMES,
  "wtt-champions": ROUND_OF_32_NAMES,
  "wtt-grand-smash": ROUND_OF_64_NAMES,
};

/** Best of 5 for every round except the semifinal and final, which are best of 7. */
function wttBestOfForRound(roundIndex: number, totalRounds: number): number {
  return roundIndex >= totalRounds - 2 ? 7 : 5;
}

export function generateSeriesBracket(config: SeriesConfig): SeriesTournament {
  const participants = toParticipants(config.participants);

  let rounds;
  if (config.seriesFormat === "nba-playoffs") {
    rounds = withRoundNames(
      buildEliminationRounds(seedNbaPlayoffsField(participants), { bestOf: 7 }),
      NBA_PLAYOFFS_ROUND_NAMES,
    );
  } else if (config.seriesFormat === "default") {
    rounds = buildEliminationRounds(participants, { bestOf: config.bestOf });
  } else {
    const bracketSize = WTT_BRACKET_SIZE[config.seriesFormat];
    rounds = withRoundNames(
      propagateAdvancement(
        buildEliminationRoundsWithByes(participants, bracketSize, {
          bestOfForRound: wttBestOfForRound,
        }),
      ),
      WTT_ROUND_NAMES[config.seriesFormat],
    );
  }

  return {
    id: crypto.randomUUID(),
    name: config.name,
    description: config.description,
    createdAt: new Date().toISOString(),
    format: "series-bracket",
    bracket: { rounds },
  };
}

export { WTT_DRAW_SIZE };
