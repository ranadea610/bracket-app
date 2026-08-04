import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import { createParticipantSlots } from "../participants/slots";
import type { SeriesConfig } from "../../tournament/types";
import type { SeriesDraft } from "./draftTypes";

const SIZES = [4, 8, 16, 32, 64, 128, 256];
const BEST_OF_OPTIONS = [3, 5, 7];

type SeriesSetupProps = {
  draft: SeriesDraft;
  onDraftChange: (draft: SeriesDraft) => void;
  onSubmit: (config: SeriesConfig) => void;
  error: string | null;
};

export function SeriesSetup({
  draft,
  onDraftChange,
  onSubmit,
  error,
}: SeriesSetupProps) {
  const { name, size, bestOf, description, participants } = draft;
  const ready = Boolean(size && bestOf);

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
      <TournamentNameInput
        value={name}
        onChange={(name) => onDraftChange({ ...draft, name })}
      />

      <NumberDropdown
        label="Bracket size"
        options={SIZES}
        selected={size}
        onSelect={(size) =>
          onDraftChange({ ...draft, size, participants: createParticipantSlots(size) })
        }
      />

      <NumberDropdown
        label="Series length (best of)"
        options={BEST_OF_OPTIONS}
        selected={bestOf}
        onSelect={(bestOf) => onDraftChange({ ...draft, bestOf })}
      />

      {ready && (
        <>
          <ParticipantList
            participants={participants}
            onChange={(participants) => onDraftChange({ ...draft, participants })}
          />

          <TournamentDescriptionInput
            value={description}
            onChange={(description) => onDraftChange({ ...draft, description })}
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
