type TournamentDescriptionInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TournamentDescriptionInput({
  value,
  onChange,
}: TournamentDescriptionInputProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Description (optional)
      </h3>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any notes about this tournament…"
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400"
      />
    </div>
  );
}
