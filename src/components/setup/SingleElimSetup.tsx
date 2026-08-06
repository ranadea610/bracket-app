import { OptionDropdown } from "../OptionDropdown";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import { GroupedParticipantList } from "../participants/GroupedParticipantList";
import { createParticipantSlots } from "../participants/slots";
import type { SingleElimConfig } from "../../tournament/types";
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
