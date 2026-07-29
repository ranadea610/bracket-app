import type { Group } from "../tournament/types";
import { Modal } from "./Modal";

type GroupResultsModalProps = {
  group: Group;
  advancePerGroup: number;
  onSaveMatch: (
    matchIndex: number,
    score: { participant1: number; participant2: number },
  ) => void;
  onClose: () => void;
};

export function GroupResultsModal({
  group,
  advancePerGroup,
  onSaveMatch,
  onClose,
}: GroupResultsModalProps) {
  const allScored = group.matches.every((m) => m.score);

  const handleScoreChange = (
    matchIndex: number,
    side: "participant1" | "participant2",
    value: string,
  ) => {
    const match = group.matches[matchIndex];
    const current = match.score ?? { participant1: 0, participant2: 0 };
    const parsed = value === "" ? 0 : Number(value);

    onSaveMatch(matchIndex, { ...current, [side]: parsed });
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-base font-semibold text-slate-100 mb-4">
        {group.name}
      </h3>

      <div className="space-y-2">
        {group.matches.map((match, matchIndex) => (
          <div
            key={match.id}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          >
            <span className="flex-1 truncate text-sm text-slate-100">
              {match.participant1?.name}
            </span>
            <input
              type="number"
              value={match.score?.participant1 ?? ""}
              onChange={(e) =>
                handleScoreChange(matchIndex, "participant1", e.target.value)
              }
              className="w-14 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-center text-sm text-slate-100 outline-none focus:border-indigo-400"
            />
            <span className="text-slate-500">–</span>
            <input
              type="number"
              value={match.score?.participant2 ?? ""}
              onChange={(e) =>
                handleScoreChange(matchIndex, "participant2", e.target.value)
              }
              className="w-14 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-center text-sm text-slate-100 outline-none focus:border-indigo-400"
            />
            <span className="flex-1 truncate text-right text-sm text-slate-100">
              {match.participant2?.name}
            </span>
          </div>
        ))}
      </div>

      <table className="mt-5 w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-500">
            <th className="text-left font-medium pb-1">Team</th>
            <th className="text-center font-medium pb-1">W-D-L</th>
            <th className="text-center font-medium pb-1">GD</th>
            <th className="text-right font-medium pb-1">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((standing, index) => (
            <tr
              key={standing.participant.id}
              className={
                index < advancePerGroup
                  ? "text-slate-100 bg-indigo-500/10"
                  : "text-slate-400"
              }
            >
              <td className="truncate py-1 pl-1">{standing.participant.name}</td>
              <td className="text-center py-1">
                {standing.wins}-{standing.draws}-{standing.losses}
              </td>
              <td className="text-center py-1">
                {standing.goalsFor - standing.goalsAgainst}
              </td>
              <td className="text-right py-1 pr-1 font-medium">
                {standing.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          onClick={onClose}
          disabled={!allScored}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed"
        >
          Finalize Group
        </button>
      </div>
    </Modal>
  );
}
