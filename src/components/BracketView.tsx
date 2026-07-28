import type { EliminationBracket } from "../tournament/types";

type BracketViewProps = {
  bracket: EliminationBracket;
};

export function BracketView({ bracket }: BracketViewProps) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Tournament Bracket
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-2">
        {bracket.rounds.map((round) => (
          <div key={round.roundNumber} className="flex-shrink-0">
            <h3 className="text-sm font-semibold text-indigo-400 mb-3">
              {round.name ?? `Round ${round.roundNumber}`}
            </h3>

            <div className="space-y-3">
              {round.matches.map((match) => (
                <div
                  key={match.id}
                  className="min-w-[160px] rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                >
                  {match.bestOf && (
                    <div className="mb-1.5 inline-block rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                      Bo{match.bestOf}
                    </div>
                  )}
                  <div className="text-sm text-slate-100">
                    {match.participant1?.name || "TBD"}
                  </div>
                  <div className="text-sm text-slate-100">
                    {match.participant2?.name || "TBD"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
