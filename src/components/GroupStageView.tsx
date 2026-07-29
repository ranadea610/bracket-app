import { useState } from "react";
import type { GroupStage } from "../tournament/types";
import { GroupResultsModal } from "./GroupResultsModal";

type GroupStageViewProps = {
  groupStage: GroupStage;
  onRecordMatch: (
    groupIndex: number,
    matchIndex: number,
    score: { participant1: number; participant2: number },
  ) => void;
  onCreateKnockout: () => void;
  knockoutCreated: boolean;
};

export function GroupStageView({
  groupStage,
  onRecordMatch,
  onCreateKnockout,
  knockoutCreated,
}: GroupStageViewProps) {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(
    null,
  );

  const allGroupsComplete = groupStage.groups.every((group) =>
    group.matches.every((match) => match.score),
  );

  const activeGroup =
    activeGroupIndex !== null ? groupStage.groups[activeGroupIndex] : null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-1">
        Group Stage
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Top {groupStage.advancePerGroup} from each group advance to the
        knockout bracket. Click a group to enter match results.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groupStage.groups.map((group, groupIndex) => {
          const played = group.matches.filter((m) => m.score).length;
          const complete = played === group.matches.length;

          return (
            <button
              type="button"
              key={group.id}
              disabled={knockoutCreated}
              onClick={() => setActiveGroupIndex(groupIndex)}
              className="text-left rounded-xl border border-slate-700 bg-slate-800/50 p-4 hover:border-indigo-500 disabled:hover:border-slate-700 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-indigo-400">
                  {group.name}
                </h3>
                {complete && (
                  <span className="text-xs text-emerald-400">✓ Complete</span>
                )}
                {!complete && played > 0 && (
                  <span className="text-xs text-slate-500">
                    {played}/{group.matches.length} played
                  </span>
                )}
              </div>

              {played === 0 ? (
                <ul className="space-y-1">
                  {group.participants.map((participant) => (
                    <li
                      key={participant.id}
                      className="text-sm text-slate-200"
                    >
                      {participant.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {group.standings.map((standing, index) => (
                      <tr
                        key={standing.participant.id}
                        className={
                          index < groupStage.advancePerGroup
                            ? "text-slate-100"
                            : "text-slate-500"
                        }
                      >
                        <td className="truncate py-0.5">
                          {standing.participant.name}
                        </td>
                        <td className="text-right py-0.5 pl-2 font-medium">
                          {standing.points} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {knockoutCreated ? (
          <p className="text-sm text-slate-500">Knockout bracket created.</p>
        ) : (
          <button
            type="button"
            onClick={onCreateKnockout}
            disabled={!allGroupsComplete}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed"
          >
            Create Knockout Bracket
          </button>
        )}
      </div>

      {activeGroup && activeGroupIndex !== null && (
        <GroupResultsModal
          group={activeGroup}
          advancePerGroup={groupStage.advancePerGroup}
          onSaveMatch={(matchIndex, score) =>
            onRecordMatch(activeGroupIndex, matchIndex, score)
          }
          onClose={() => setActiveGroupIndex(null)}
        />
      )}
    </div>
  );
}
