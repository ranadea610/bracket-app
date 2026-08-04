import { useState } from "react";
import type { Match, Participant } from "../../tournament/types";
import { Modal } from "../Modal";
import { ScoreInput } from "../ScoreInput";

type GameScore = { participant1: number; participant2: number };

type SeriesResultModalProps = {
  match: Match;
  onSubmit: (winner: Participant, score: GameScore) => void;
  onClose: () => void;
};

function tallyGames(games: (GameScore | undefined)[], requiredWins: number) {
  let wins1 = 0;
  let wins2 = 0;
  let decidedAt: number | null = null;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    if (!game) break;

    if (game.participant1 > game.participant2) wins1++;
    else if (game.participant2 > game.participant1) wins2++;

    if (wins1 === requiredWins || wins2 === requiredWins) {
      decidedAt = i;
      break;
    }
  }

  return { wins1, wins2, decidedAt };
}

export function SeriesResultModal({
  match,
  onSubmit,
  onClose,
}: SeriesResultModalProps) {
  const participant1 = match.participant1!;
  const participant2 = match.participant2!;
  const bestOf = match.bestOf!;
  const requiredWins = Math.ceil((bestOf + 1) / 2);

  const [games, setGames] = useState<(GameScore | undefined)[]>(
    Array(bestOf).fill(undefined),
  );

  const { wins1, wins2, decidedAt } = tallyGames(games, requiredWins);

  const visibleCount = (() => {
    if (decidedAt !== null) return decidedAt + 1;
    const firstUnentered = games.findIndex((g) => !g);
    return firstUnentered === -1 ? bestOf : Math.min(firstUnentered + 1, bestOf);
  })();

  const handleScoreChange = (
    gameIndex: number,
    side: "participant1" | "participant2",
    value: number,
  ) => {
    const current = games[gameIndex] ?? { participant1: 0, participant2: 0 };
    const updated = { ...current, [side]: value };

    const next = games.map((g, i) => (i === gameIndex ? updated : g));
    const { decidedAt: newDecidedAt } = tallyGames(next, requiredWins);

    // Editing an earlier game can move up (or remove) the decision point;
    // clear anything entered past the new decision so state stays consistent.
    const cleared = next.map((g, i) =>
      newDecidedAt !== null && i > newDecidedAt ? undefined : g,
    );

    setGames(cleared);
  };

  const handleFinalize = () => {
    if (decidedAt === null) return;
    const winner = wins1 === requiredWins ? participant1 : participant2;
    onSubmit(winner, { participant1: wins1, participant2: wins2 });
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-base font-semibold text-slate-100 mb-1">
        Enter Series Result
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        {participant1.name} {wins1} – {wins2} {participant2.name} · First to{" "}
        {requiredWins} wins
      </p>

      <div className="space-y-2">
        {Array.from({ length: visibleCount }, (_, gameIndex) => {
          const game = games[gameIndex];

          return (
            <div
              key={gameIndex}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            >
              <span className="w-14 shrink-0 text-xs text-slate-500">
                Game {gameIndex + 1}
              </span>
              <span className="flex-1 truncate text-sm text-slate-100">
                {participant1.name}
              </span>
              <ScoreInput
                value={game?.participant1 ?? 0}
                onChange={(value) =>
                  handleScoreChange(gameIndex, "participant1", value)
                }
              />
              <span className="text-slate-500">–</span>
              <ScoreInput
                value={game?.participant2 ?? 0}
                onChange={(value) =>
                  handleScoreChange(gameIndex, "participant2", value)
                }
              />
              <span className="flex-1 truncate text-right text-sm text-slate-100">
                {participant2.name}
              </span>
            </div>
          );
        })}
      </div>

      {decidedAt !== null && (
        <p className="mt-3 text-sm text-indigo-400">
          Series decided — {wins1 === requiredWins ? participant1.name : participant2.name}{" "}
          wins {wins1}-{wins2}.
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-indigo-400 transition-colors cursor-pointer"
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleFinalize}
          disabled={decidedAt === null}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed"
        >
          Finalize Series
        </button>
      </div>
    </Modal>
  );
}
