import { useState } from "react";
import { NumberSelector } from "../NumberSelector";
import { TournamentNameInput } from "../TournamentNameInput";
import { ParticipantInput } from "../ParticipantInput";
import type { SeriesConfig } from "../../tournament/types";

const SIZES = [4, 8, 16, 32, 64, 128, 256];
const BEST_OF_OPTIONS = [3, 5, 7];

type SeriesSetupProps = {
  onSubmit: (config: SeriesConfig) => void;
  error: string | null;
};

export function SeriesSetup({ onSubmit, error }: SeriesSetupProps) {
  const [size, setSize] = useState<number | null>(null);
  const [bestOf, setBestOf] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleNames = (names: string[]) => {
    if (!size || !bestOf) return;

    if (names.length !== size) {
      setLocalError(
        `Expected ${size} names, but got ${names.length}. Please try again.`,
      );
      return;
    }

    setLocalError(null);
    onSubmit({
      format: "series-bracket",
      name: name.trim() || "My Tournament",
      participants: names,
      bestOf,
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

      <NumberSelector
        label="Series length (best of)"
        options={BEST_OF_OPTIONS}
        selected={bestOf}
        onSelect={setBestOf}
      />

      <TournamentNameInput value={name} onChange={setName} />

      {size && bestOf && (
        <ParticipantInput
          expectedCount={size}
          onSubmitNames={handleNames}
          error={localError ?? error}
        />
      )}
    </div>
  );
}
