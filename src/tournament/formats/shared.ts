import type { Match, Participant, Round } from "../types";

export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

export function toParticipants(names: string[]): Participant[] {
  return names.map((name, index) => ({
    id: crypto.randomUUID(),
    name,
    seed: index + 1,
  }));
}

/**
 * Builds a full single-elimination round structure from a list of already-seeded
 * participants. participants.length must be a power of two. Rounds after the
 * first are left empty (TBD) until winners are recorded.
 */
export function buildEliminationRounds(
  participants: Participant[],
  opts?: { bestOf?: number },
): Round[] {
  if (!isPowerOfTwo(participants.length)) {
    throw new Error(
      `Number of participants (${participants.length}) must be a power of 2.`,
    );
  }

  const rounds: Round[] = [];

  const firstRoundMatches: Match[] = [];
  for (let i = 0; i < participants.length; i += 2) {
    firstRoundMatches.push({
      id: crypto.randomUUID(),
      participant1: participants[i],
      participant2: participants[i + 1],
      bestOf: opts?.bestOf,
    });
  }

  rounds.push({ roundNumber: 1, matches: firstRoundMatches });

  let matchesInRound = firstRoundMatches.length;
  let roundNumber = 2;

  while (matchesInRound > 1) {
    matchesInRound = matchesInRound / 2;

    const matches: Match[] = [];
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: crypto.randomUUID(),
        bestOf: opts?.bestOf,
      });
    }

    rounds.push({ roundNumber, matches });
    roundNumber++;
  }

  return rounds;
}

/** All unique unordered pairings among participants, unplayed. */
export function generateRoundRobin(participants: Participant[]): Match[] {
  const matches: Match[] = [];

  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      matches.push({
        id: crypto.randomUUID(),
        participant1: participants[i],
        participant2: participants[j],
      });
    }
  }

  return matches;
}
