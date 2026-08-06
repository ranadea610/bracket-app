import type { Participant, SingleElimConfig, SingleElimTournament } from "../types";
import { buildEliminationRounds, toParticipants, withRoundNames } from "./shared";
import { reseedForBracket } from "./seeding";

const MARCH_MADNESS_ROUND_NAMES = [
  "Round of 64",
  "Round of 32",
  "Sweet 16",
  "Elite Eight",
  "Final Four",
  "Championship",
];

const REGION_SIZE = 16;

/** Reseeds each 16-participant region independently, then concatenates them. */
function seedMarchMadnessField(participants: Participant[]): Participant[] {
  const regions: Participant[][] = [];
  for (let i = 0; i < participants.length; i += REGION_SIZE) {
    regions.push(reseedForBracket(participants.slice(i, i + REGION_SIZE)));
  }
  return regions.flat();
}

export function generateSingleElim(
  config: SingleElimConfig,
): SingleElimTournament {
  const participants = toParticipants(config.participants);

  const rounds =
    config.bracketFormat === "march-madness"
      ? withRoundNames(
          buildEliminationRounds(seedMarchMadnessField(participants)),
          MARCH_MADNESS_ROUND_NAMES,
        )
      : buildEliminationRounds(participants);

  return {
    id: crypto.randomUUID(),
    name: config.name,
    description: config.description,
    createdAt: new Date().toISOString(),
    format: "single-elim",
    bracket: { rounds },
  };
}
