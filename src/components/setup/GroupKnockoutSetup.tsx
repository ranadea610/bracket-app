import { useState } from "react";
import { NumberSelector } from "../NumberSelector";
import { TournamentNameInput } from "../TournamentNameInput";
import { ParticipantInput } from "../ParticipantInput";
import type { GroupKnockoutConfig } from "../../tournament/types";

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
  const [numGroups, setNumGroups] = useState<number | null>(null);
  const [groupSize, setGroupSize] = useState<number | null>(null);
  const [advancePerGroup, setAdvancePerGroup] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const totalParticipants =
    numGroups && groupSize ? numGroups * groupSize : null;

  const handleNames = (names: string[]) => {
    if (!totalParticipants || !advancePerGroup || !groupSize) return;

    if (names.length !== totalParticipants) {
      setLocalError(
        `Expected ${totalParticipants} names, but got ${names.length}. Please try again.`,
      );
      return;
    }

    setLocalError(null);
    onSubmit({
      format: "group-knockout",
      name: name.trim() || "My Tournament",
      participants: names,
      groupSize,
      advancePerGroup,
    });
  };

  return (
    <div className="space-y-6">
      <NumberSelector
        label="Number of groups"
        options={NUM_GROUPS_OPTIONS}
        selected={numGroups}
        onSelect={setNumGroups}
      />

      <NumberSelector
        label="Participants per group"
        options={GROUP_SIZE_OPTIONS}
        selected={groupSize}
        onSelect={setGroupSize}
      />

      <NumberSelector
        label="Advance per group to knockout stage"
        options={ADVANCE_OPTIONS}
        selected={advancePerGroup}
        onSelect={setAdvancePerGroup}
      />

      <TournamentNameInput value={name} onChange={setName} />

      {totalParticipants && advancePerGroup && (
        <>
          <p className="text-sm text-slate-400">
            Total participants: {totalParticipants}
          </p>
          <ParticipantInput
            expectedCount={totalParticipants}
            onSubmitNames={handleNames}
            error={localError ?? error}
          />
        </>
      )}
    </div>
  );
}
