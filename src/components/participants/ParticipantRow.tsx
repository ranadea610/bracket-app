import type { DragEvent } from "react";

type ParticipantRowProps = {
  seed: number;
  value: string;
  onChange: (value: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragStart: (e: DragEvent<HTMLSpanElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
};

export function ParticipantRow({
  seed,
  value,
  onChange,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}: ParticipantRowProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5"
    >
      <span
        draggable
        onDragStart={onDragStart}
        className="cursor-grab select-none px-1 text-slate-500 hover:text-slate-300 active:cursor-grabbing"
        title="Drag to reorder"
      >
        ⠿
      </span>

      <span className="w-6 shrink-0 text-right text-xs text-slate-500">
        {seed}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Participant ${seed}`}
        className="min-w-0 flex-1 bg-transparent px-1 py-1 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
      />

      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="px-1 text-xs leading-none text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="px-1 text-xs leading-none text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Move down"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
