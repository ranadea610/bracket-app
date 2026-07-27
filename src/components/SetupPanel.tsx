import { BracketSizeSelector } from "./BracketSizeSelector";
import { ParticipantInput } from "./ParticipantInput";

type SetupPanelProps = {
  bracketSize: number | null;
  setBracketSize: (size: number) => void;
  onCreateBracket: (names: string[]) => void;
  error: string | null;
};

export function SetupPanel({
  bracketSize,
  setBracketSize,
  onCreateBracket,
  error,
}: SetupPanelProps) {
  return (
    <div>
      <BracketSizeSelector
        selectedSize={bracketSize}
        onSelectSize={setBracketSize}
      />

      {bracketSize && (
        <ParticipantInput
          expectedCount={bracketSize}
          onSubmitNames={onCreateBracket}
          error={error}
        />
      )}
    </div>
  );
}
