import { useState } from "react";
import { OptionDropdown } from "../OptionDropdown";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import { GroupedParticipantList } from "../participants/GroupedParticipantList";
import { createParticipantSlots } from "../participants/slots";
import { resolveGroupSlot } from "../participants/groupSlot";
import { BracketPreview } from "../bracket/BracketPreview";
import type { EliminationBracket, SingleElimConfig } from "../../tournament/types";
import { generateSingleElim } from "../../tournament/formats/singleElim";
import { buildMarchMadnessGroups, type SingleElimDraft } from "./draftTypes";

const SIZES = [4, 8, 16, 32, 64, 128, 256];

const FORMAT_OPTIONS = [
  { value: "default" as const, label: "Default" },
  { value: "march-madness" as const, label: "March Madness" },
];

type SingleElimSetupProps = {
  draft: SingleElimDraft;
  onDraftChange: (draft: SingleElimDraft) => void;
  onSubmit: (config: SingleElimConfig) => void;
  error: string | null;
};

export function SingleElimSetup({
  draft,
  onDraftChange,
  onSubmit,
  error,
}: SingleElimSetupProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { name, description } = draft;

  const handleFormatChange = (bracketFormat: "default" | "march-madness") => {
    if (bracketFormat === "default") {
      onDraftChange({
        format: "single-elim",
        bracketFormat: "default",
        name,
        description,
        size: null,
        participants: [],
      });
    } else {
      onDraftChange({
        format: "single-elim",
        bracketFormat: "march-madness",
        name,
        description,
        groups: buildMarchMadnessGroups(),
      });
    }
  };

  const allNamed =
    draft.bracketFormat === "default"
      ? draft.participants.length > 0 &&
        draft.participants.every((p) => p.name.trim().length > 0)
      : draft.groups.length > 0 &&
        draft.groups.every((g) =>
          g.participants.every((p) => p.name.trim().length > 0),
        );

  const handleCreate = () => {
    if (!allNamed) return;

    if (draft.bracketFormat === "default") {
      if (!draft.size) return;
      onSubmit({
        format: "single-elim",
        bracketFormat: "default",
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants: draft.participants.map((p) => p.name.trim()),
      });
    } else {
      onSubmit({
        format: "single-elim",
        bracketFormat: "march-madness",
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants: draft.groups.flatMap((g) =>
          g.participants.map((p) => p.name.trim()),
        ),
      });
    }
  };

  const readyForParticipants =
    (draft.bracketFormat === "default" && draft.size) ||
    draft.bracketFormat === "march-madness";

  const rawFlatNames =
    draft.bracketFormat === "default"
      ? draft.participants.map((p) => p.name.trim())
      : draft.groups.flatMap((g) => g.participants.map((p) => p.name.trim()));
  const flatNames = rawFlatNames.map((name, i) => name || `Participant ${i + 1}`);

  let previewBracket: EliminationBracket | null = null;
  if (showPreview && flatNames.length > 0) {
    try {
      previewBracket = generateSingleElim({
        format: "single-elim",
        bracketFormat: draft.bracketFormat,
        name: "",
        participants: flatNames,
      }).bracket;
    } catch {
      previewBracket = null;
    }
  }

  const handleSwapSeeds = (seedA: number, seedB: number) => {
    if (draft.bracketFormat === "default") {
      const next = [...draft.participants];
      [next[seedA - 1], next[seedB - 1]] = [next[seedB - 1], next[seedA - 1]];
      onDraftChange({ ...draft, participants: next });
    } else {
      const a = resolveGroupSlot(draft.groups, seedA - 1);
      const b = resolveGroupSlot(draft.groups, seedB - 1);
      const nextGroups = draft.groups.map((g) => ({
        ...g,
        participants: [...g.participants],
      }));
      const temp = nextGroups[a.groupIndex].participants[a.slotIndex];
      nextGroups[a.groupIndex].participants[a.slotIndex] =
        nextGroups[b.groupIndex].participants[b.slotIndex];
      nextGroups[b.groupIndex].participants[b.slotIndex] = temp;
      onDraftChange({ ...draft, groups: nextGroups });
    }
  };

  return (
    <div className="space-y-6">
      <TournamentNameInput
        value={name}
        onChange={(name) => onDraftChange({ ...draft, name })}
      />

      <OptionDropdown
        label="Tournament format"
        options={FORMAT_OPTIONS}
        selected={draft.bracketFormat}
        onSelect={handleFormatChange}
      />

      {draft.bracketFormat === "default" && (
        <NumberDropdown
          label="Bracket size"
          options={SIZES}
          selected={draft.size}
          onSelect={(size) =>
            onDraftChange({ ...draft, size, participants: createParticipantSlots(size) })
          }
        />
      )}

      {draft.bracketFormat === "march-madness" && (
        <p className="text-sm text-slate-400">
          64 teams — 4 regions of 16, standard tournament seeding.
        </p>
      )}

      {readyForParticipants && (
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
              {draft.bracketFormat === "default" ? (
                <ParticipantList
                  participants={draft.participants}
                  onChange={(participants) => onDraftChange({ ...draft, participants })}
                />
              ) : (
                <GroupedParticipantList
                  groups={draft.groups}
                  onChange={(groups) => onDraftChange({ ...draft, groups })}
                />
              )}
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
