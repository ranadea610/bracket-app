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
import type { GroupKnockoutDraft } from "./draftTypes";

const NUM_GROUPS_OPTIONS = [2, 4, 8];
const GROUP_SIZE_OPTIONS = [3, 4, 5, 6];
const ADVANCE_OPTIONS = [1, 2];

type GroupKnockoutSetupProps = {
  draft: GroupKnockoutDraft;
  onDraftChange: (draft: GroupKnockoutDraft) => void;
  onSubmit: (config: GroupKnockoutConfig) => void;
  error: string | null;
};

function buildGroups(
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
  const { name, numGroups, groupSize, advancePerGroup, description, groups } =
    draft;

  const ready = Boolean(numGroups && groupSize && advancePerGroup);
  const totalParticipants =
    numGroups && groupSize ? numGroups * groupSize : null;

  const allNamed =
    groups.length > 0 &&
    groups.every((group) =>
      group.participants.every((p) => p.name.trim().length > 0),
    );

  const handleCreate = () => {
    if (!groupSize || !advancePerGroup || !allNamed) return;

    const participants = groups.flatMap((group) =>
      group.participants.map((p) => p.name.trim()),
    );

    onSubmit({
      format: "group-knockout",
      name: name.trim() || "My Tournament",
      description: description.trim() || undefined,
      participants,
      groupSize,
      advancePerGroup,
    });
  };

  return (
    <div className="space-y-6">
      <TournamentNameInput
        value={name}
        onChange={(name) => onDraftChange({ ...draft, name })}
      />

      <NumberDropdown
        label="Number of groups"
        options={NUM_GROUPS_OPTIONS}
        selected={numGroups}
        onSelect={(numGroups) =>
          onDraftChange({
            ...draft,
            numGroups,
            groups: buildGroups(numGroups, groupSize),
          })
        }
      />

      <NumberDropdown
        label="Participants per group"
        options={GROUP_SIZE_OPTIONS}
        selected={groupSize}
        onSelect={(groupSize) =>
          onDraftChange({
            ...draft,
            groupSize,
            groups: buildGroups(numGroups, groupSize),
          })
        }
      />

      <NumberDropdown
        label="Advance per group to knockout stage"
        options={ADVANCE_OPTIONS}
        selected={advancePerGroup}
        onSelect={(advancePerGroup) =>
          onDraftChange({ ...draft, advancePerGroup })
        }
      />

      {ready && (
        <>
          {totalParticipants && (
            <p className="text-sm text-slate-400">
              Total participants: {totalParticipants}
            </p>
          )}

          <GroupedParticipantList
            groups={groups}
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
