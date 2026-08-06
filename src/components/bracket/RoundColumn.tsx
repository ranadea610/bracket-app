import type { ReactNode } from "react";
import type { Match, Round } from "../../tournament/types";
import {
  getMatchCenterY,
  getRoundX,
  HEADER_HEIGHT,
  MATCH_HEIGHT,
  MATCH_WIDTH,
} from "./geometry";

type RoundColumnProps = {
  round: Round;
  roundIndex: number;
  round0MatchCount: number;
  canvasHeight: number;
  onSelectRound: (roundIndex: number) => void;
  renderMatch: (match: Match, roundIndex: number, matchIndex: number, top: number) => ReactNode;
};

export function RoundColumn({
  round,
  roundIndex,
  round0MatchCount,
  canvasHeight,
  onSelectRound,
  renderMatch,
}: RoundColumnProps) {
  return (
    <div
      className="absolute top-0"
      style={{ left: getRoundX(roundIndex), width: MATCH_WIDTH, height: canvasHeight }}
    >
      <button
        type="button"
        onClick={() => onSelectRound(roundIndex)}
        className="absolute top-0 left-0 w-full text-left text-sm font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
        style={{ height: HEADER_HEIGHT }}
      >
        {round.name ?? `Round ${round.roundNumber}`}
      </button>

      {round.matches.map((match, matchIndex) => {
        const centerY = getMatchCenterY(
          roundIndex,
          matchIndex,
          round0MatchCount,
        );

        return renderMatch(
          match,
          roundIndex,
          matchIndex,
          HEADER_HEIGHT + centerY - MATCH_HEIGHT / 2,
        );
      })}
    </div>
  );
}
