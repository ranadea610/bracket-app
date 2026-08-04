type ScoreInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function ScoreInput({ value, onChange }: ScoreInputProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="rounded-md border border-slate-700 px-2 py-1 text-sm text-slate-200 hover:border-indigo-400 cursor-pointer"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) =>
          onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))
        }
        className="w-12 rounded-md border border-slate-700 bg-slate-900 px-1 py-1 text-center text-sm text-slate-100 outline-none focus:border-indigo-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="rounded-md border border-slate-700 px-2 py-1 text-sm text-slate-200 hover:border-indigo-400 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
