import type { Match, Participant } from "../../tournament/types";
import { MATCH_HEIGHT, MATCH_WIDTH } from "./geometry";

type MatchCardProps = {
  match: Match;
  top: number;
  left: number;
  onOpenResultModal?: () => void;
};

export function MatchCard({ match, top, left, onOpenResultModal }: MatchCardProps) {
  const ready = Boolean(match.participant1 && match.participant2);

  const nameClass = (participant?: Participant) => {
    if (!match.winner || !participant) return "text-slate-100";
    return participant.id === match.winner.id
      ? "text-slate-100 font-semibold"
      : "text-slate-500 line-through";
  };

  const row = (participant: Participant | undefined, score: number | undefined) => (
    <div className={`flex items-center justify-between gap-2 text-sm ${nameClass(participant)}`}>
      <span className="truncate">{participant?.name || "TBD"}</span>
      {score !== undefined && (
        <span className="shrink-0 text-slate-300">{score}</span>
      )}
    </div>
  );

  return (
    <div
      className={`absolute flex flex-col justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-3 ${
        ready ? "cursor-pointer hover:border-indigo-500" : ""
      }`}
      style={{
        top,
        left,
        width: MATCH_WIDTH,
        height: MATCH_HEIGHT,
      }}
      onClick={ready ? onOpenResultModal : undefined}
    >
      {match.bestOf && (
        <div className="mb-1.5 self-start rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
          Bo{match.bestOf}
        </div>
      )}
      {row(match.participant1, match.score?.participant1)}
      {row(match.participant2, match.score?.participant2)}
    </div>
  );
}
