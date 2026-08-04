import { useEffect, useState } from "react";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import {
  createParticipantSlots,
  type ParticipantSlot,
} from "../participants/slots";
import type { DoubleElimConfig } from "../../tournament/types";

const SIZES = [4, 8, 16, 32, 64, 128, 256];

type DoubleElimSetupProps = {
  onSubmit: (config: DoubleElimConfig) => void;
  error: string | null;
};

export function DoubleElimSetup({ onSubmit, error }: DoubleElimSetupProps) {
  const [name, setName] = useState("");
  const [size, setSize] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<ParticipantSlot[]>([]);

  useEffect(() => {
    setParticipants(size ? createParticipantSlots(size) : []);
  }, [size]);

  const allNamed =
    participants.length > 0 &&
    participants.every((p) => p.name.trim().length > 0);

  const handleCreate = () => {
    if (!size || !allNamed) return;

    onSubmit({
      format: "double-elim",
      name: name.trim() || "My Tournament",
      description: description.trim() || undefined,
      participants: participants.map((p) => p.name.trim()),
    });
  };

  return (
    <div className="space-y-6">
      <TournamentNameInput value={name} onChange={setName} />

      <NumberDropdown
        label="Bracket size"
        options={SIZES}
        selected={size}
        onSelect={setSize}
      />

      {size && (
        <>
          <ParticipantList
            participants={participants}
            onChange={setParticipants}
          />

          <TournamentDescriptionInput
            value={description}
            onChange={setDescription}
          />

          <div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!allNamed}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-indigo-500 cursor-pointer"
            >
              Create Bracket
            </button>
            {!allNamed && (
              <p className="mt-2 text-sm text-slate-500">
                Name every participant to continue
              </p>
            )}
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}
