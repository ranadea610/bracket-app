type Option<T extends string> = {
  value: T;
  label: string;
};

type OptionDropdownProps<T extends string> = {
  label: string;
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
};

export function OptionDropdown<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: OptionDropdownProps<T>) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">{label}</h3>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value as T)}
          className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
