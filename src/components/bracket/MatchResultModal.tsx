import { useState } from "react";
import type { Match, Participant } from "../../tournament/types";
import { Modal } from "../Modal";

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
  const [winnerId, setWinnerId] = useState<string | null>(
    match.winner?.id ?? null,
  );

  const handleSave = () => {
    const winner = winnerId === participant1.id ? participant1 : participant2;
    onSubmit(winner, { participant1: score1, participant2: score2 });
  };

  const row = (
    participant: Participant,
    score: number,
    setScore: (n: number) => void,
  ) => {
    const selected = winnerId === participant.id;

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => setWinnerId(participant.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setWinnerId(participant.id);
        }}
        className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
          selected
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-700 bg-slate-800 hover:border-slate-600"
        }`}
      >
        <span className="text-sm text-slate-100 truncate">
          {participant.name}
        </span>
        <input
          type="number"
          value={score}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-16 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-sm text-slate-100 outline-none focus:border-indigo-400"
        />
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
          disabled={!winnerId}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed"
        >
          Save Result
        </button>
      </div>
    </Modal>
  );
}
