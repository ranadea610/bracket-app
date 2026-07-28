type TournamentNameInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TournamentNameInput({
  value,
  onChange,
  placeholder = "My Tournament",
}: TournamentNameInputProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Tournament name
      </h3>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400"
      />
    </div>
  );
}
