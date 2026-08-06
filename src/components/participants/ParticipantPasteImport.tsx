import { useState, type ClipboardEvent } from "react";
import { extractPlayerNames } from "./extractPlayerNames";

type ParticipantPasteImportProps = {
  expectedCount: number;
  onExtract: (names: string[]) => void;
};

export function ParticipantPasteImport({
  expectedCount,
  onExtract,
}: ParticipantPasteImportProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [extractedCount, setExtractedCount] = useState<number | null>(null);

  const runExtract = (source: string) => {
    const names = extractPlayerNames(source);
    setExtractedCount(names.length);
    onExtract(names);
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    runExtract(pasted);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
      >
        {open ? "Hide paste box" : "Paste participant list"}
      </button>

      {open && (
        <div className="mt-2">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
            placeholder="Paste the copied participant list here…"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400"
          />

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => runExtract(text)}
              className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-indigo-400 cursor-pointer"
            >
              Extract names
            </button>

            {extractedCount !== null && (
              <p
                className={`text-sm ${
                  extractedCount === expectedCount
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                Extracted {extractedCount} name{extractedCount === 1 ? "" : "s"}
                {extractedCount !== expectedCount
                  ? ` (expected ${expectedCount})`
                  : ""}
                .
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
