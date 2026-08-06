import type { DragEvent } from "react";
import type { Match, Participant } from "../../tournament/types";
import { MATCH_HEIGHT, MATCH_WIDTH } from "./geometry";

type PreviewMatchCardProps = {
  match: Match;
  top: number;
  left: number;
  onSwapSeeds: (seedA: number, seedB: number) => void;
};

export function PreviewMatchCard({
  match,
  top,
  left,
  onSwapSeeds,
}: PreviewMatchCardProps) {
  const nameClass = (participant?: Participant) => {
    if (!match.winner || !participant) return "text-slate-100";
    return participant.id === match.winner.id
      ? "text-slate-100 font-semibold"
      : "text-slate-500 line-through";
  };

  const handleDragStart = (seed: number) => (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", String(seed));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (seed: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceSeed = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(sourceSeed) && sourceSeed !== seed) {
      onSwapSeeds(sourceSeed, seed);
    }
  };

  const row = (participant: Participant | undefined) => {
    const draggable = Boolean(participant?.seed);

    return (
      <div
        draggable={draggable}
        onDragStart={draggable ? handleDragStart(participant!.seed!) : undefined}
        onDragOver={draggable ? handleDragOver : undefined}
        onDrop={draggable ? handleDrop(participant!.seed!) : undefined}
        className={`flex items-center gap-2 text-sm rounded px-1 -mx-1 ${nameClass(participant)} ${
          draggable ? "cursor-grab hover:bg-slate-700/50 active:cursor-grabbing" : ""
        }`}
      >
        <span className="truncate">
          {participant?.name || (match.winner ? "BYE" : "TBD")}
        </span>
      </div>
    );
  };

  return (
    <div
      className="absolute flex flex-col justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-3"
      style={{
        top,
        left,
        width: MATCH_WIDTH,
        height: MATCH_HEIGHT,
      }}
    >
      {match.bestOf && (
        <div className="mb-1.5 self-start rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
          Bo{match.bestOf}
        </div>
      )}
      {row(match.participant1)}
      {row(match.participant2)}
    </div>
  );
}
