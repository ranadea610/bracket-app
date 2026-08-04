import type { DoubleElimConfig, DoubleElimTournament, Round } from "../types";
import { buildEliminationRounds, toParticipants } from "./shared";
import { planLosersBracket } from "./doubleElimStructure";

export function generateDoubleElim(
  config: DoubleElimConfig,
): DoubleElimTournament {
  const participants = toParticipants(config.participants);
  const winnersRounds = buildEliminationRounds(participants);

  const lbPlan = planLosersBracket(participants.length);
  const losersRounds: Round[] = lbPlan.map((plan, index) => ({
    roundNumber: index + 1,
    name: `Losers Round ${index + 1}`,
    matches: Array.from({ length: plan.size }, () => ({
      id: crypto.randomUUID(),
    })),
  }));

  const grandFinalsRounds: Round[] = [
    { roundNumber: 1, name: "Grand Final", matches: [{ id: crypto.randomUUID() }] },
    {
      roundNumber: 2,
      name: "Grand Final Reset",
      matches: [{ id: crypto.randomUUID() }],
    },
  ];

  return {
    id: crypto.randomUUID(),
    name: config.name,
    description: config.description,
    createdAt: new Date().toISOString(),
    format: "double-elim",
    winnersBracket: { rounds: winnersRounds },
    losersBracket: { rounds: losersRounds },
    grandFinals: { rounds: grandFinalsRounds },
  };
}
