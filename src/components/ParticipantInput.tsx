import { useState } from "react";

type ParticipantInputProps = {
  expectedCount: number;
  onSubmitNames: (names: string[]) => void;
  error: string | null;
};

export function ParticipantInput({
  expectedCount,
  onSubmitNames,
  error,
}: ParticipantInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const names = inputValue
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    onSubmitNames(names);
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Enter {expectedCount} participant names</h3>

      <textarea
        rows={4}
        style={{ width: "100%" }}
        placeholder="Alice, Bob, Charlie, Dana"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <p>
        Current count:{" "}
        {
          inputValue
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n.length > 0).length
        }
        / {expectedCount}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit}>Create Bracket</button>
    </div>
  );
}
