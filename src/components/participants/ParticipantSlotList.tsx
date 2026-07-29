import type { DragEvent } from "react";
import { ParticipantRow } from "./ParticipantRow";
import { reorder } from "./reorder";
import type { ParticipantSlot } from "./slots";

type ParticipantSlotListProps = {
  participants: ParticipantSlot[];
  onChange: (participants: ParticipantSlot[]) => void;
};

export function ParticipantSlotList({
  participants,
  onChange,
}: ParticipantSlotListProps) {
  const updateName = (index: number, name: string) => {
    const next = [...participants];
    next[index] = { ...next[index], name };
    onChange(next);
  };

  const move = (from: number, to: number) => {
    onChange(reorder(participants, from, to));
  };

  const handleDragStart = (index: number) => (e: DragEvent<HTMLSpanElement>) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from)) return;
    move(from, index);
  };

  return (
    <div className="space-y-2">
      {participants.map((participant, index) => (
        <ParticipantRow
          key={participant.id}
          seed={index + 1}
          value={participant.name}
          onChange={(name) => updateName(index, name)}
          onMoveUp={() => move(index, index - 1)}
          onMoveDown={() => move(index, index + 1)}
          canMoveUp={index > 0}
          canMoveDown={index < participants.length - 1}
          onDragStart={handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={handleDrop(index)}
        />
      ))}
    </div>
  );
}
