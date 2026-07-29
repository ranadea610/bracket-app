type NumberDropdownProps = {
  label: string;
  options: number[];
  selected: number | null;
  onSelect: (value: number) => void;
};

export function NumberDropdown({
  label,
  options,
  selected,
  onSelect,
}: NumberDropdownProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">{label}</h3>
      <div className="relative">
        <select
          value={selected ?? ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
          ▾
        </span>
      </div>
    </div>
  );
}
