import { ParticipantSlotList } from "./ParticipantSlotList";
import { ParticipantPasteImport } from "./ParticipantPasteImport";
import type { ParticipantSlot } from "./slots";

type ParticipantListProps = {
  participants: ParticipantSlot[];
  onChange: (participants: ParticipantSlot[]) => void;
};

export function ParticipantList({ participants, onChange }: ParticipantListProps) {
  const handleExtract = (names: string[]) => {
    onChange(participants.map((slot, i) => ({ ...slot, name: names[i] ?? "" })));
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Participants (in seed order)
      </h3>

      <div className="mb-3">
        <ParticipantPasteImport
          expectedCount={participants.length}
          onExtract={handleExtract}
        />
      </div>

      <ParticipantSlotList participants={participants} onChange={onChange} />
    </div>
  );
}
