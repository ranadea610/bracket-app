import type { Round } from "../../tournament/types";

export const MATCH_WIDTH = 200;
// Tall enough to fit two participant names plus the optional "BoN" badge
// line without overflowing the card (see MatchCard.tsx).
export const MATCH_HEIGHT = 92;
export const COLUMN_GAP = 64;
export const HEADER_HEIGHT = 40;
// Vertical spacing between round-0 match centers.
export const ROUND0_PITCH = MATCH_HEIGHT + 32;

/** X offset (px) of a round column's left edge, relative to the canvas origin. */
export function getRoundX(roundIndex: number): number {
  return roundIndex * (MATCH_WIDTH + COLUMN_GAP);
}

/**
 * Y offset (px) of the center of match `matchIndex` within round `roundIndex`,
 * relative to the top of the match area (below the round headers).
 *
 * Every round shares the same total match-area height. Round r has half as
 * many matches as round r-1, evenly spaced within that same height, which is
 * exactly what puts each match at the midpoint of the two matches feeding it.
 */
export function getMatchCenterY(
  roundIndex: number,
  matchIndex: number,
  round0MatchCount: number,
): number {
  const matchAreaHeight = round0MatchCount * ROUND0_PITCH;
  const matchCountInRound = round0MatchCount / Math.pow(2, roundIndex);
  return (matchAreaHeight * (matchIndex + 0.5)) / matchCountInRound;
}

export function getMatchAreaHeight(round0MatchCount: number): number {
  return round0MatchCount * ROUND0_PITCH;
}

export function getCanvasSize(rounds: Round[]): {
  width: number;
  height: number;
} {
  const round0MatchCount = rounds[0]?.matches.length ?? 0;

  return {
    width:
      rounds.length > 0
        ? getRoundX(rounds.length - 1) + MATCH_WIDTH
        : 0,
    height: HEADER_HEIGHT + getMatchAreaHeight(round0MatchCount),
  };
}
