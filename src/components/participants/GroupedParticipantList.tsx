import { ParticipantSlotList } from "./ParticipantSlotList";
import type { ParticipantSlot } from "./slots";

export type ParticipantGroup = {
  id: string;
  label: string;
  participants: ParticipantSlot[];
};

type GroupedParticipantListProps = {
  groups: ParticipantGroup[];
  onChange: (groups: ParticipantGroup[]) => void;
};

export function GroupedParticipantList({
  groups,
  onChange,
}: GroupedParticipantListProps) {
  const updateGroup = (groupIndex: number, participants: ParticipantSlot[]) => {
    const next = [...groups];
    next[groupIndex] = { ...next[groupIndex], participants };
    onChange(next);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Participants (grouped, in seed order)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group, groupIndex) => (
          <div
            key={group.id}
            className="rounded-xl border border-slate-700 bg-slate-800/30 p-3"
          >
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">
              {group.label}
            </h4>
            <ParticipantSlotList
              participants={group.participants}
              onChange={(participants) => updateGroup(groupIndex, participants)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
