import { ParticipantSlotList } from "./ParticipantSlotList";
import type { ParticipantSlot } from "./slots";

type ParticipantListProps = {
  participants: ParticipantSlot[];
  onChange: (participants: ParticipantSlot[]) => void;
};

export function ParticipantList({ participants, onChange }: ParticipantListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Participants (in seed order)
      </h3>
      <ParticipantSlotList participants={participants} onChange={onChange} />
    </div>
  );
}
