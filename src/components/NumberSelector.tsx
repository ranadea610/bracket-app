type NumberSelectorProps = {
  label: string;
  options: number[];
  selected: number | null;
  onSelect: (value: number) => void;
};

export function NumberSelector({
  label,
  options,
  selected,
  onSelect,
}: NumberSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              selected === value
                ? "bg-indigo-500 border-indigo-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-200 hover:border-indigo-400"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
