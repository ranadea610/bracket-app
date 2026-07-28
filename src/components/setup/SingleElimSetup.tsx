import { useState } from "react";
import { NumberSelector } from "../NumberSelector";
import { TournamentNameInput } from "../TournamentNameInput";
import { ParticipantInput } from "../ParticipantInput";
import type { SingleElimConfig } from "../../tournament/types";

const SIZES = [4, 8, 16, 32, 64, 128, 256];

type SingleElimSetupProps = {
  onSubmit: (config: SingleElimConfig) => void;
  error: string | null;
};

export function SingleElimSetup({ onSubmit, error }: SingleElimSetupProps) {
  const [size, setSize] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleNames = (names: string[]) => {
    if (!size) return;

    if (names.length !== size) {
      setLocalError(
        `Expected ${size} names, but got ${names.length}. Please try again.`,
      );
      return;
    }

    setLocalError(null);
    onSubmit({
      format: "single-elim",
      name: name.trim() || "My Tournament",
      participants: names,
    });
  };

  return (
    <div className="space-y-6">
      <NumberSelector
        label="Bracket size"
        options={SIZES}
        selected={size}
        onSelect={setSize}
      />

      <TournamentNameInput value={name} onChange={setName} />

      {size && (
        <ParticipantInput
          expectedCount={size}
          onSubmitNames={handleNames}
          error={localError ?? error}
        />
      )}
    </div>
  );
}
