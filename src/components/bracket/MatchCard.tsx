import type { Match, Participant } from "../../tournament/types";
import { MATCH_HEIGHT, MATCH_WIDTH } from "./geometry";

type MatchCardProps = {
  match: Match;
  top: number;
  left: number;
  onSelectWinner?: (participant: Participant) => void;
  onOpenResultModal?: () => void;
};

export function MatchCard({
  match,
  top,
  left,
  onSelectWinner,
  onOpenResultModal,
}: MatchCardProps) {
  const ready = Boolean(match.participant1 && match.participant2);

  const nameClass = (participant?: Participant) => {
    if (!match.winner || !participant) return "text-slate-100";
    return participant.id === match.winner.id
      ? "text-slate-100 font-semibold"
      : "text-slate-500 line-through";
  };

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
      <button
        type="button"
        disabled={!ready}
        onClick={(e) => {
          e.stopPropagation();
          if (match.participant1) onSelectWinner?.(match.participant1);
        }}
        className={`block w-full truncate border-0 bg-transparent p-0 text-left text-sm ${nameClass(match.participant1)} ${
          ready ? "cursor-pointer hover:text-indigo-400" : "cursor-default"
        }`}
      >
        {match.participant1?.name || "TBD"}
      </button>
      <button
        type="button"
        disabled={!ready}
        onClick={(e) => {
          e.stopPropagation();
          if (match.participant2) onSelectWinner?.(match.participant2);
        }}
        className={`block w-full truncate border-0 bg-transparent p-0 text-left text-sm ${nameClass(match.participant2)} ${
          ready ? "cursor-pointer hover:text-indigo-400" : "cursor-default"
        }`}
      >
        {match.participant2?.name || "TBD"}
      </button>
    </div>
  );
}
