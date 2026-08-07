import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "../../auth/types";
import { deleteBracket, listBrackets } from "../../brackets/bracketsApi";
import type { SavedBracket } from "../../brackets/types";
import type { TournamentFormat } from "../../tournament/types";

const FORMAT_LABELS: Record<TournamentFormat, string> = {
  "single-elim": "Single Elimination",
  "series-bracket": "Series",
  "group-knockout": "Group Stage",
  "double-elim": "Double Elimination",
};

function formatRelativeTime(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

type MyBracketsRailProps = {
  user: AuthUser;
  onLoadBracket: (saved: SavedBracket) => void;
  refreshToken: number;
};

export function MyBracketsRail({ user, onLoadBracket, refreshToken }: MyBracketsRailProps) {
  const [open, setOpen] = useState(false);
  const [brackets, setBrackets] = useState<SavedBracket[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    listBrackets(user.id).then((result) => {
      setBrackets(result);
      setLoading(false);
    });
  }, [user.id]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh, refreshToken]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this saved bracket? This can't be undone.")) return;
    await deleteBracket(id);
    refresh();
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-30 flex h-full w-14 flex-col items-center border-r border-slate-800 bg-slate-950 pt-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-medium tracking-wide text-slate-400 hover:text-indigo-400 cursor-pointer [writing-mode:vertical-rl]"
        >
          My Brackets
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="fixed left-14 top-0 z-40 h-full w-72 overflow-y-auto border-r border-slate-700 bg-slate-900 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-100">My Brackets</h3>

            {loading && <p className="text-sm text-slate-500">Loading…</p>}
            {!loading && brackets.length === 0 && (
              <p className="text-sm text-slate-500">No saved brackets yet.</p>
            )}

            {!loading && (
              <ul className="space-y-2">
                {brackets.map((b) => (
                  <li
                    key={b.id}
                    onClick={() => {
                      onLoadBracket(b);
                      setOpen(false);
                    }}
                    className="flex items-start justify-between gap-2 rounded-lg border border-slate-700 p-2 hover:border-indigo-400 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">{b.name}</p>
                      <p className="text-xs text-slate-500">
                        {FORMAT_LABELS[b.format]} · {formatRelativeTime(b.updatedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(b.id);
                      }}
                      aria-label="Delete saved bracket"
                      className="shrink-0 text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}
