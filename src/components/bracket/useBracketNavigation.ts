import { useRef, useState } from "react";
import type { Round } from "../../tournament/types";
import { getCanvasSize, getRoundX, HEADER_HEIGHT, MATCH_WIDTH } from "./geometry";

const MIN_SCALE = 0.3;
const MAX_SCALE = 2;

/**
 * Shared zoom/pan/round-centering behavior for anything rendered via
 * BracketCanvas -- used by both the production BracketView and the setup
 * BracketPreview, which need identical navigation.
 */
export function useBracketNavigation(rounds: Round[]) {
  const [scale, setScale] = useState(1);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return {
    scale,
    currentRoundIndex,
    roundCount,
    scrollRef,
    goToRound,
    handleZoom,
    handleFit,
  };
}
