import type { TournamentFormat } from "../tournament/types";
import type { AuthUser } from "../auth/types";

type NavbarProps = {
  active: TournamentFormat;
  onSelect: (format: TournamentFormat) => void;
  user: AuthUser | null;
  onSignUp: () => void;
  onLogIn: () => void;
  onLogOut: () => void;
};

const TABS: { format: TournamentFormat; label: string }[] = [
  { format: "single-elim", label: "Single Elimination" },
  { format: "series-bracket", label: "Series" },
  { format: "group-knockout", label: "Group Stage" },
  { format: "double-elim", label: "Double Elimination" },
];

export function Navbar({ active, onSelect, user, onSignUp, onLogIn, onLogOut }: NavbarProps) {
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

        <div className="flex items-center gap-3 whitespace-nowrap">
          {user ? (
            <>
              <span className="text-sm text-slate-300">{user.username}</span>
              <button
                type="button"
                onClick={onLogOut}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-indigo-400 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLogIn}
                className="text-sm text-slate-300 hover:text-slate-100 cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onSignUp}
                className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
