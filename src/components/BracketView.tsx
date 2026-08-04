import { useRef, useState } from "react";
import type { EliminationBracket, Participant } from "../tournament/types";
import { BracketCanvas } from "./bracket/BracketCanvas";
import { MatchResultModal } from "./bracket/MatchResultModal";
import { SeriesResultModal } from "./bracket/SeriesResultModal";
import { getCanvasSize, getRoundX, HEADER_HEIGHT, MATCH_WIDTH } from "./bracket/geometry";

type BracketViewProps = {
  bracket: EliminationBracket;
  onSetWinner: (
    roundIndex: number,
    matchIndex: number,
    winner: Participant,
    score?: { participant1: number; participant2: number },
  ) => void;
};

const MIN_SCALE = 0.3;
const MAX_SCALE = 2;

export function BracketView({ bracket, onSetWinner }: BracketViewProps) {
  const [scale, setScale] = useState(1);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<{
    roundIndex: number;
    matchIndex: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rounds = bracket.rounds;
  const roundCount = rounds.length;

  const clampScale = (value: number) =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const centerOnRound = (roundIndex: number, atScale: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const { height } = getCanvasSize(rounds);
    const targetX = (getRoundX(roundIndex) + MATCH_WIDTH / 2) * atScale;
    const targetY = ((height + HEADER_HEIGHT) / 2) * atScale;

    container.scrollTo({
      left: targetX - container.clientWidth / 2,
      top: targetY - container.clientHeight / 2,
      behavior: "smooth",
    });
  };

  const goToRound = (roundIndex: number) => {
    setCurrentRoundIndex(roundIndex);
    centerOnRound(roundIndex, scale);
  };

  const handleZoom = (factor: number) => {
    setScale((prev) => clampScale(prev * factor));
  };

  const handleFit = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { width, height } = getCanvasSize(rounds);
    const fitScale = clampScale(
      Math.min(
        container.clientWidth / width,
        container.clientHeight / height,
        1,
      ),
    );

    setScale(fitScale);
    setCurrentRoundIndex(0);
    container.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Tournament Bracket
      </h2>

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
            ◀ Prev round
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
            Next round ▶
          </button>
        </div>
      </div>

      <BracketCanvas
        ref={scrollRef}
        rounds={rounds}
        scale={scale}
        onSelectRound={goToRound}
        onOpenResultModal={(roundIndex, matchIndex) =>
          setActiveModal({ roundIndex, matchIndex })
        }
      />

      {activeModal &&
        (() => {
          const match =
            rounds[activeModal.roundIndex].matches[activeModal.matchIndex];
          const handleSubmit = (
            winner: Participant,
            score: { participant1: number; participant2: number },
          ) => {
            onSetWinner(activeModal.roundIndex, activeModal.matchIndex, winner, score);
            setActiveModal(null);
          };

          return match.bestOf ? (
            <SeriesResultModal
              match={match}
              onClose={() => setActiveModal(null)}
              onSubmit={handleSubmit}
            />
          ) : (
            <MatchResultModal
              match={match}
              onClose={() => setActiveModal(null)}
              onSubmit={handleSubmit}
            />
          );
        })()}
    </div>
  );
}
