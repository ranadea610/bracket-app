import { OptionDropdown } from "../OptionDropdown";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import {
  GroupedParticipantList,
  type ParticipantGroup,
} from "../participants/GroupedParticipantList";
import { createParticipantSlots } from "../participants/slots";
import type { GroupKnockoutConfig } from "../../tournament/types";
import { groupName } from "../../tournament/formats/groupKnockout";
import { buildWorldCupGroups, type GroupKnockoutDraft } from "./draftTypes";

const NUM_GROUPS_OPTIONS = [2, 4, 8];
const GROUP_SIZE_OPTIONS = [3, 4, 5, 6];
const ADVANCE_OPTIONS = [1, 2];

const FORMAT_OPTIONS = [
  { value: "default" as const, label: "Default" },
  { value: "world-cup" as const, label: "World Cup" },
];

type GroupKnockoutSetupProps = {
  draft: GroupKnockoutDraft;
  onDraftChange: (draft: GroupKnockoutDraft) => void;
  onSubmit: (config: GroupKnockoutConfig) => void;
  error: string | null;
};

function buildDefaultGroups(
  numGroups: number | null,
  groupSize: number | null,
): ParticipantGroup[] {
  if (!numGroups || !groupSize) return [];

  return Array.from({ length: numGroups }, (_, i) => ({
    id: crypto.randomUUID(),
    label: groupName(i),
    participants: createParticipantSlots(groupSize),
  }));
}

export function GroupKnockoutSetup({
  draft,
  onDraftChange,
  onSubmit,
  error,
}: GroupKnockoutSetupProps) {
  const { name, description } = draft;

  const handleFormatChange = (groupFormat: "default" | "world-cup") => {
    if (groupFormat === "default") {
      onDraftChange({
        format: "group-knockout",
        groupFormat: "default",
        name,
        description,
        numGroups: null,
        groupSize: null,
        advancePerGroup: null,
        groups: [],
      });
    } else {
      onDraftChange({
        format: "group-knockout",
        groupFormat: "world-cup",
        name,
        description,
        groups: buildWorldCupGroups(),
      });
    }
  };

  const ready =
    draft.groupFormat === "default"
      ? Boolean(draft.numGroups && draft.groupSize && draft.advancePerGroup)
      : true;

  const totalParticipants =
    draft.groupFormat === "default"
      ? draft.numGroups && draft.groupSize
        ? draft.numGroups * draft.groupSize
        : null
      : 48;

  const allNamed =
    draft.groups.length > 0 &&
    draft.groups.every((group) =>
      group.participants.every((p) => p.name.trim().length > 0),
    );

  const handleCreate = () => {
    if (!allNamed) return;

    const participants = draft.groups.flatMap((group) =>
      group.participants.map((p) => p.name.trim()),
    );

    if (draft.groupFormat === "default") {
      if (!draft.groupSize || !draft.advancePerGroup) return;
      onSubmit({
        format: "group-knockout",
        groupFormat: "default",
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants,
        groupSize: draft.groupSize,
        advancePerGroup: draft.advancePerGroup,
      });
    } else {
      onSubmit({
        format: "group-knockout",
        groupFormat: "world-cup",
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants,
      });
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
        selected={draft.groupFormat}
        onSelect={handleFormatChange}
      />

      {draft.groupFormat === "default" && (
        <>
          <NumberDropdown
            label="Number of groups"
            options={NUM_GROUPS_OPTIONS}
            selected={draft.numGroups}
            onSelect={(numGroups) =>
              onDraftChange({
                ...draft,
                numGroups,
                groups: buildDefaultGroups(numGroups, draft.groupSize),
              })
            }
          />

          <NumberDropdown
            label="Participants per group"
            options={GROUP_SIZE_OPTIONS}
            selected={draft.groupSize}
            onSelect={(groupSize) =>
              onDraftChange({
                ...draft,
                groupSize,
                groups: buildDefaultGroups(draft.numGroups, groupSize),
              })
            }
          />

          <NumberDropdown
            label="Advance per group to knockout stage"
            options={ADVANCE_OPTIONS}
            selected={draft.advancePerGroup}
            onSelect={(advancePerGroup) =>
              onDraftChange({ ...draft, advancePerGroup })
            }
          />
        </>
      )}

      {draft.groupFormat === "world-cup" && (
        <p className="text-sm text-slate-400">
          48 teams — 12 groups of 4. Top 2 per group plus the 8 best
          third-place teams advance to a Round of 32.
        </p>
      )}

      {ready && (
        <>
          {totalParticipants && (
            <p className="text-sm text-slate-400">
              Total participants: {totalParticipants}
            </p>
          )}

          <GroupedParticipantList
            groups={draft.groups}
            onChange={(groups) => onDraftChange({ ...draft, groups })}
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
