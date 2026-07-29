import { useEffect, useState } from "react";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import {
  createParticipantSlots,
  type ParticipantSlot,
} from "../participants/slots";
import type { SeriesConfig } from "../../tournament/types";

const SIZES = [4, 8, 16, 32, 64, 128, 256];
const BEST_OF_OPTIONS = [3, 5, 7];

type SeriesSetupProps = {
  onSubmit: (config: SeriesConfig) => void;
  error: string | null;
};

export function SeriesSetup({ onSubmit, error }: SeriesSetupProps) {
  const [name, setName] = useState("");
  const [size, setSize] = useState<number | null>(null);
  const [bestOf, setBestOf] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<ParticipantSlot[]>([]);

  const ready = Boolean(size && bestOf);

  useEffect(() => {
    setParticipants(size ? createParticipantSlots(size) : []);
  }, [size]);

  const allNamed =
    participants.length > 0 &&
    participants.every((p) => p.name.trim().length > 0);

  const handleCreate = () => {
    if (!size || !bestOf || !allNamed) return;

    onSubmit({
      format: "series-bracket",
      name: name.trim() || "My Tournament",
      description: description.trim() || undefined,
      participants: participants.map((p) => p.name.trim()),
      bestOf,
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

      <NumberDropdown
        label="Series length (best of)"
        options={BEST_OF_OPTIONS}
        selected={bestOf}
        onSelect={setBestOf}
      />

      {ready && (
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
