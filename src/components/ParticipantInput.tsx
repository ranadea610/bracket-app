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

  const currentCount = inputValue
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n.length > 0).length;

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Enter {expectedCount} participant names
      </h3>

      <textarea
        rows={4}
        placeholder="Alice, Bob, Charlie, Dana"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400"
      />

      <p
        className={`mt-2 text-sm ${
          currentCount === expectedCount ? "text-slate-400" : "text-amber-400"
        }`}
      >
        Current count: {currentCount} / {expectedCount}
      </p>

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer"
      >
        Create Bracket
      </button>
    </div>
  );
}
