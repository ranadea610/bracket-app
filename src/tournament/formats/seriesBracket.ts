import type { SeriesConfig, SeriesTournament } from "../types";
import { buildEliminationRounds, toParticipants } from "./shared";

export function generateSeriesBracket(config: SeriesConfig): SeriesTournament {
  const participants = toParticipants(config.participants);
  const rounds = buildEliminationRounds(participants, {
    bestOf: config.bestOf,
  });

  return {
    id: crypto.randomUUID(),
    name: config.name,
    description: config.description,
    createdAt: new Date().toISOString(),
    format: "series-bracket",
    bracket: { rounds },
  };
}
