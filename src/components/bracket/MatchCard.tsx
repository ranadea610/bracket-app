import type { Match } from "../../tournament/types";
import { MATCH_HEIGHT, MATCH_WIDTH } from "./geometry";

type MatchCardProps = {
  match: Match;
  top: number;
  left: number;
};

export function MatchCard({ match, top, left }: MatchCardProps) {
  return (
    <div
      className="absolute rounded-lg border border-slate-700 bg-slate-800/50 p-3"
      style={{
        top,
        left,
        width: MATCH_WIDTH,
        height: MATCH_HEIGHT,
      }}
    >
      {match.bestOf && (
        <div className="mb-1.5 inline-block rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
          Bo{match.bestOf}
        </div>
      )}
      <div className="truncate text-sm text-slate-100">
        {match.participant1?.name || "TBD"}
      </div>
      <div className="truncate text-sm text-slate-100">
        {match.participant2?.name || "TBD"}
      </div>
    </div>
  );
}
