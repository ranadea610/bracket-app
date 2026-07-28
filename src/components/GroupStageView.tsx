import type { GroupStage } from "../tournament/types";

type GroupStageViewProps = {
  groupStage: GroupStage;
};

export function GroupStageView({ groupStage }: GroupStageViewProps) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-1">
        Group Stage
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Top {groupStage.advancePerGroup} from each group advance to the
        knockout bracket. Recording group results and seeding the knockout
        bracket is coming soon.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groupStage.groups.map((group) => (
          <div
            key={group.id}
            className="rounded-xl border border-slate-700 bg-slate-800/50 p-4"
          >
            <h3 className="text-sm font-semibold text-indigo-400 mb-2">
              {group.name}
            </h3>
            <ul className="space-y-1">
              {group.participants.map((participant) => (
                <li key={participant.id} className="text-sm text-slate-200">
                  {participant.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
