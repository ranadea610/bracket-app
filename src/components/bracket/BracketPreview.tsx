import type { EliminationBracket } from "../../tournament/types";
import { BracketCanvas } from "./BracketCanvas";
import { MatchCard } from "./MatchCard";
import { PreviewMatchCard } from "./PreviewMatchCard";
import { useBracketNavigation } from "./useBracketNavigation";

type BracketPreviewProps = {
  bracket: EliminationBracket | null;
  onSwapSeeds: (seedA: number, seedB: number) => void;
};

export function BracketPreview({ bracket, onSwapSeeds }: BracketPreviewProps) {
  const rounds = bracket?.rounds ?? [];
  const { scale, currentRoundIndex, roundCount, scrollRef, goToRound, handleZoom, handleFit } =
    useBracketNavigation(rounds);

  if (!bracket) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Bracket preview — drag a name to reseed
      </h3>

      <div className="mb-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleZoom(1 / 1.25)}
            className="rounded-lg border border-slate-700 px-2.5 py-1 text-sm text-slate-200 hover:border-indigo-400 cursor-pointer"
          >
            −
          </button>
          <span className="w-12 text-center text-sm text-slate-400">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(1.25)}
            className="rounded-lg border border-slate-700 px-2.5 py-1 text-sm text-slate-200 hover:border-indigo-400 cursor-pointer"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleFit}
            className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-indigo-400 cursor-pointer"
          >
            Fit
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentRoundIndex === 0}
            onClick={() => goToRound(currentRoundIndex - 1)}
            className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-indigo-400 disabled:opacity-40 disabled:hover:border-slate-700 cursor-pointer disabled:cursor-not-allowed"
          >
            ◀
          </button>
          <span className="text-sm text-slate-400">
            Round {currentRoundIndex + 1} of {roundCount}
          </span>
          <button
            type="button"
            disabled={currentRoundIndex === roundCount - 1}
            onClick={() => goToRound(currentRoundIndex + 1)}
            className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-indigo-400 disabled:opacity-40 disabled:hover:border-slate-700 cursor-pointer disabled:cursor-not-allowed"
          >
            ▶
          </button>
        </div>
      </div>

      <BracketCanvas
        ref={scrollRef}
        rounds={rounds}
        scale={scale}
        onSelectRound={goToRound}
        renderMatch={(match, roundIndex, _matchIndex, top) =>
          roundIndex === 0 ? (
            <PreviewMatchCard
              key={match.id}
              match={match}
              left={0}
              top={top}
              onSwapSeeds={onSwapSeeds}
            />
          ) : (
            <MatchCard key={match.id} match={match} left={0} top={top} />
          )
        }
      />
    </div>
  );
}
