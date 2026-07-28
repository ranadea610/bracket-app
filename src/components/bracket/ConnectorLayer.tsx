import { COLUMN_GAP, getMatchCenterY, getRoundX, HEADER_HEIGHT, MATCH_WIDTH } from "./geometry";

type ConnectorLayerProps = {
  roundIndex: number;
  nextRoundMatchCount: number;
  round0MatchCount: number;
  canvasHeight: number;
};

/**
 * Draws the elbow connectors between round `roundIndex` and round
 * `roundIndex + 1`: each pair of matches (2i, 2i+1) in the left round joins
 * into match i of the right round at their shared vertical midpoint.
 */
export function ConnectorLayer({
  roundIndex,
  nextRoundMatchCount,
  round0MatchCount,
  canvasHeight,
}: ConnectorLayerProps) {
  const left = getRoundX(roundIndex) + MATCH_WIDTH;
  const halfWidth = COLUMN_GAP / 2;

  return (
    <svg
      className="absolute top-0"
      style={{ left, width: COLUMN_GAP, height: canvasHeight }}
    >
      {Array.from({ length: nextRoundMatchCount }, (_, i) => {
        const y1 = HEADER_HEIGHT + getMatchCenterY(roundIndex, 2 * i, round0MatchCount);
        const y2 = HEADER_HEIGHT + getMatchCenterY(roundIndex, 2 * i + 1, round0MatchCount);
        const yMid = (y1 + y2) / 2;

        return (
          <g key={i} stroke="#475569" strokeWidth={2} fill="none">
            <line x1={0} y1={y1} x2={halfWidth} y2={y1} />
            <line x1={0} y1={y2} x2={halfWidth} y2={y2} />
            <line x1={halfWidth} y1={y1} x2={halfWidth} y2={y2} />
            <line x1={halfWidth} y1={yMid} x2={COLUMN_GAP} y2={yMid} />
          </g>
        );
      })}
    </svg>
  );
}
