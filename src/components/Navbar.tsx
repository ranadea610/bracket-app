import type { TournamentFormat } from "../tournament/types";

type NavbarProps = {
  active: TournamentFormat;
  onSelect: (format: TournamentFormat) => void;
};

const TABS: { format: TournamentFormat; label: string }[] = [
  { format: "single-elim", label: "Single Elimination" },
  { format: "series-bracket", label: "Series" },
  { format: "group-knockout", label: "Group Stage" },
];

export function Navbar({ active, onSelect }: NavbarProps) {
  return (
    <header className="border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <h1 className="text-xl font-semibold text-slate-100 whitespace-nowrap">
          Tournament Bracket Generator
        </h1>

        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.format}
              type="button"
              onClick={() => onSelect(tab.format)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors cursor-pointer border-b-2 ${
                active === tab.format
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
