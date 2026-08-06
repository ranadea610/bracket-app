import { useState } from "react";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import { createParticipantSlots } from "../participants/slots";
import { BracketPreview } from "../bracket/BracketPreview";
import type { DoubleElimConfig, EliminationBracket } from "../../tournament/types";
import { generateDoubleElim } from "../../tournament/formats/doubleElim";
import type { DoubleElimDraft } from "./draftTypes";

const SIZES = [4, 8, 16, 32, 64, 128, 256];

type DoubleElimSetupProps = {
  draft: DoubleElimDraft;
  onDraftChange: (draft: DoubleElimDraft) => void;
  onSubmit: (config: DoubleElimConfig) => void;
  error: string | null;
};

export function DoubleElimSetup({
  draft,
  onDraftChange,
  onSubmit,
  error,
}: DoubleElimSetupProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { name, size, description, participants } = draft;

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

  const flatNames = participants.map(
    (p, i) => p.name.trim() || `Participant ${i + 1}`,
  );

  let previewBracket: EliminationBracket | null = null;
  if (showPreview && flatNames.length > 0) {
    try {
      previewBracket = generateDoubleElim({
        format: "double-elim",
        name: "",
        participants: flatNames,
      }).winnersBracket;
    } catch {
      previewBracket = null;
    }
  }

  const handleSwapSeeds = (seedA: number, seedB: number) => {
    const next = [...participants];
    [next[seedA - 1], next[seedB - 1]] = [next[seedB - 1], next[seedA - 1]];
    onDraftChange({ ...draft, participants: next });
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

      {size && (
        <>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            {showPreview ? "Hide Bracket Preview" : "Show Bracket Preview"}
          </button>

          <div className={showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
            <div>
              <ParticipantList
                participants={participants}
                onChange={(participants) => onDraftChange({ ...draft, participants })}
              />
            </div>

            {showPreview && (
              <div>
                <BracketPreview bracket={previewBracket} onSwapSeeds={handleSwapSeeds} />
              </div>
            )}
          </div>

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
