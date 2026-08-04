import type { Participant, Round } from "./types";

/**
 * Recomputes every round after the first from the previous round's winners.
 * Runs round-by-round in order, so a change at any round cascades forward
 * automatically: if a match's participants no longer match what's feeding
 * it, its own winner/score are cleared too, which then affects the next
 * round's recompute, and so on.
 */
export function propagateAdvancement(rounds: Round[]): Round[] {
  for (let r = 1; r < rounds.length; r++) {
    const prevMatches = rounds[r - 1].matches;
    const matches = rounds[r].matches;

    for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
      const match = matches[matchIndex];
      const feederA = prevMatches[2 * matchIndex]?.winner;
      const feederB = prevMatches[2 * matchIndex + 1]?.winner;

      if (
        match.participant1?.id !== feederA?.id ||
        match.participant2?.id !== feederB?.id
      ) {
        match.participant1 = feederA;
        match.participant2 = feederB;
        match.winner = undefined;
        match.score = undefined;
      }
    }
  }

  return rounds;
}

export function setMatchWinner(
  rounds: Round[],
  roundIndex: number,
  matchIndex: number,
  winner: Participant,
  score?: { participant1: number; participant2: number },
): Round[] {
  const next = rounds.map((round) => ({
    ...round,
    matches: round.matches.map((match) => ({ ...match })),
  }));

  next[roundIndex].matches[matchIndex].winner = winner;
  next[roundIndex].matches[matchIndex].score = score;

  return propagateAdvancement(next);
}
