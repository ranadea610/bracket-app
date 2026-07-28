import type { SingleElimConfig, SingleElimTournament } from "../types";
import { buildEliminationRounds, toParticipants } from "./shared";

export function generateSingleElim(
  config: SingleElimConfig,
): SingleElimTournament {
  const participants = toParticipants(config.participants);
  const rounds = buildEliminationRounds(participants);

  return {
    id: crypto.randomUUID(),
    name: config.name,
    createdAt: new Date().toISOString(),
    format: "single-elim",
    bracket: { rounds },
  };
}
