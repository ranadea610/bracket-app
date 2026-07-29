import { useEffect, useState } from "react";
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

const NUM_GROUPS_OPTIONS = [2, 4, 8];
const GROUP_SIZE_OPTIONS = [3, 4, 5, 6];
const ADVANCE_OPTIONS = [1, 2];

type GroupKnockoutSetupProps = {
  onSubmit: (config: GroupKnockoutConfig) => void;
  error: string | null;
};

export function GroupKnockoutSetup({
  onSubmit,
  error,
}: GroupKnockoutSetupProps) {
  const [name, setName] = useState("");
  const [numGroups, setNumGroups] = useState<number | null>(null);
  const [groupSize, setGroupSize] = useState<number | null>(null);
  const [advancePerGroup, setAdvancePerGroup] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [groups, setGroups] = useState<ParticipantGroup[]>([]);

  const ready = Boolean(numGroups && groupSize && advancePerGroup);
  const totalParticipants =
    numGroups && groupSize ? numGroups * groupSize : null;

  useEffect(() => {
    if (!numGroups || !groupSize) {
      setGroups([]);
      return;
    }

    setGroups(
      Array.from({ length: numGroups }, (_, i) => ({
        id: crypto.randomUUID(),
        label: groupName(i),
        participants: createParticipantSlots(groupSize),
      })),
    );
  }, [numGroups, groupSize]);

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
      <TournamentNameInput value={name} onChange={setName} />

      <NumberDropdown
        label="Number of groups"
        options={NUM_GROUPS_OPTIONS}
        selected={numGroups}
        onSelect={setNumGroups}
      />

      <NumberDropdown
        label="Participants per group"
        options={GROUP_SIZE_OPTIONS}
        selected={groupSize}
        onSelect={setGroupSize}
      />

      <NumberDropdown
        label="Advance per group to knockout stage"
        options={ADVANCE_OPTIONS}
        selected={advancePerGroup}
        onSelect={setAdvancePerGroup}
      />

      {ready && (
        <>
          {totalParticipants && (
            <p className="text-sm text-slate-400">
              Total participants: {totalParticipants}
            </p>
          )}

          <GroupedParticipantList groups={groups} onChange={setGroups} />

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
