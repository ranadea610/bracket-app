import { forwardRef, Fragment, type ReactNode } from "react";
import type { Match, Round } from "../../tournament/types";
import { RoundColumn } from "./RoundColumn";
import { ConnectorLayer } from "./ConnectorLayer";
import { getCanvasSize } from "./geometry";

type BracketCanvasProps = {
  rounds: Round[];
  scale: number;
  onSelectRound: (roundIndex: number) => void;
  renderMatch: (match: Match, roundIndex: number, matchIndex: number, top: number) => ReactNode;
};

export const BracketCanvas = forwardRef<HTMLDivElement, BracketCanvasProps>(
  function BracketCanvas({ rounds, scale, onSelectRound, renderMatch }, ref) {
    const round0MatchCount = rounds[0]?.matches.length ?? 0;
    const { width, height } = getCanvasSize(rounds);

    return (
      <div
        ref={ref}
        className="relative h-[65vh] overflow-auto rounded-xl border border-slate-800 bg-slate-950"
      >
        {/* Sizer: establishes the scrollable extent at the current zoom level */}
        <div style={{ width: width * scale, height: height * scale }}>
          {/* Natural-size content, visually scaled */}
          <div
            className="relative"
            style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            {rounds.map((round, roundIndex) => (
              <Fragment key={round.roundNumber}>
                <RoundColumn
                  round={round}
                  roundIndex={roundIndex}
                  round0MatchCount={round0MatchCount}
                  canvasHeight={height}
                  onSelectRound={onSelectRound}
                  renderMatch={renderMatch}
                />
                {roundIndex < rounds.length - 1 && (
                  <ConnectorLayer
                    roundIndex={roundIndex}
                    nextRoundMatchCount={rounds[roundIndex + 1].matches.length}
                    round0MatchCount={round0MatchCount}
                    canvasHeight={height}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
