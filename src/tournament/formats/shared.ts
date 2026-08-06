import type { Match, Participant, Round } from "../types";
import { standardSeedOrder } from "./seeding";

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

/**
 * Like buildEliminationRounds, but `bracketSize` (a power of 2) may exceed
 * `participants.length`. The extra slots are seeded in standard bracket
 * order (see seeding.ts), so they always land on the top seeds -- whichever
 * real participant is paired against a nonexistent slot gets a bye,
 * automatically and correctly, with no extra placement logic. A bye is
 * represented as a Match with only one participant and its `winner`
 * already set, so it flows through `propagateAdvancement` exactly like any
 * other decided match. When bracketSize === participants.length this
 * produces the same shape buildEliminationRounds would, plus support for a
 * bestOf that varies by round.
 */
export function buildEliminationRoundsWithByes(
  participants: Participant[],
  bracketSize: number,
  opts?: { bestOfForRound?: (roundIndex: number, totalRounds: number) => number },
): Round[] {
  if (!isPowerOfTwo(bracketSize)) {
    throw new Error(`Bracket size (${bracketSize}) must be a power of 2.`);
  }
  if (participants.length > bracketSize) {
    throw new Error(
      `Number of participants (${participants.length}) cannot exceed bracket size (${bracketSize}).`,
    );
  }

  const slots: (Participant | undefined)[] = standardSeedOrder(bracketSize).map(
    (seed) => (seed <= participants.length ? participants[seed - 1] : undefined),
  );

  const totalRounds = Math.log2(bracketSize);
  const bestOfForRound = (roundIndex: number) =>
    opts?.bestOfForRound?.(roundIndex, totalRounds);

  const round1Matches: Match[] = [];
  for (let i = 0; i < slots.length; i += 2) {
    const participant1 = slots[i];
    const participant2 = slots[i + 1];
    const match: Match = {
      id: crypto.randomUUID(),
      participant1,
      participant2,
      bestOf: bestOfForRound(0),
    };
    // A slot with only one real participant is a bye: they advance automatically.
    if (participant1 && !participant2) match.winner = participant1;
    if (participant2 && !participant1) match.winner = participant2;
    round1Matches.push(match);
  }

  const rounds: Round[] = [{ roundNumber: 1, matches: round1Matches }];

  let matchesInRound = round1Matches.length / 2;
  let roundNumber = 2;

  while (matchesInRound >= 1) {
    const matches: Match[] = Array.from({ length: matchesInRound }, () => ({
      id: crypto.randomUUID(),
      bestOf: bestOfForRound(roundNumber - 1),
    }));
    rounds.push({ roundNumber, matches });
    matchesInRound = matchesInRound / 2;
    roundNumber++;
  }

  return rounds;
}

/** Overrides round names positionally; falls back to the existing round if a name isn't supplied. */
export function withRoundNames(rounds: Round[], names: string[]): Round[] {
  return rounds.map((round, i) => (names[i] ? { ...round, name: names[i] } : round));
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
