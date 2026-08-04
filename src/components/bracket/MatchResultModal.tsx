import { useState } from "react";
import type { Match, Participant } from "../../tournament/types";
import { Modal } from "../Modal";
import { ScoreInput } from "../ScoreInput";

type MatchResultModalProps = {
  match: Match;
  onSubmit: (
    winner: Participant,
    score: { participant1: number; participant2: number },
  ) => void;
  onClose: () => void;
};

export function MatchResultModal({
  match,
  onSubmit,
  onClose,
}: MatchResultModalProps) {
  const participant1 = match.participant1!;
  const participant2 = match.participant2!;

  const [score1, setScore1] = useState(match.score?.participant1 ?? 0);
  const [score2, setScore2] = useState(match.score?.participant2 ?? 0);

  const winner =
    score1 > score2 ? participant1 : score2 > score1 ? participant2 : null;

  const handleSave = () => {
    if (!winner) return;
    onSubmit(winner, { participant1: score1, participant2: score2 });
  };

  const row = (
    participant: Participant,
    score: number,
    setScore: (n: number) => void,
  ) => {
    const isWinner = winner?.id === participant.id;

    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors ${
          isWinner
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-700 bg-slate-800"
        }`}
      >
        <span className="text-sm text-slate-100 truncate">
          {participant.name}
        </span>
        <ScoreInput value={score} onChange={setScore} />
      </div>
    );
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-base font-semibold text-slate-100 mb-4">
        Enter Result
      </h3>

      <div className="space-y-2">
        {row(participant1, score1, setScore1)}
        {row(participant2, score2, setScore2)}
      </div>

      {!winner && (
        <p className="mt-3 text-sm text-amber-400">
          Scores can't be tied — adjust one to determine a winner.
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-indigo-400 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!winner}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed"
        >
          Save Result
        </button>
      </div>
    </Modal>
  );
}
