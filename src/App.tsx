import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { SingleElimSetup } from "./components/setup/SingleElimSetup";
import { SeriesSetup } from "./components/setup/SeriesSetup";
import { GroupKnockoutSetup } from "./components/setup/GroupKnockoutSetup";
import { BracketView } from "./components/BracketView";
import { GroupStageView } from "./components/GroupStageView";
import { ChampionModal } from "./components/bracket/ChampionModal";
import { generateTournament } from "./tournament/generate";
import { setMatchWinner } from "./tournament/advance";
import { recordGroupMatchResult } from "./tournament/groupStandings";
import { generateKnockoutFromGroups } from "./tournament/formats/groupKnockout";
import type {
  EliminationBracket,
  Participant,
  Tournament,
  TournamentConfig,
  TournamentFormat,
} from "./tournament/types";

function App() {
  // =======================
  // STATE
  // =======================

  const [activeFormat, setActiveFormat] =
    useState<TournamentFormat>("single-elim");
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [champion, setChampion] = useState<Participant | null>(null);

  // =======================
  // HANDLERS
  // =======================

  const handleSelectTab = (format: TournamentFormat) => {
    setActiveFormat(format);
    setTournament(null);
    setError(null);
  };

  const handleCreate = (config: TournamentConfig) => {
    try {
      setError(null);
      setTournament(generateTournament(config));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tournament.");
    }
  };

  const handleReset = () => {
    setTournament(null);
    setError(null);
  };

  const handleSetWinner = (
    roundIndex: number,
    matchIndex: number,
    winner: Participant,
    score?: { participant1: number; participant2: number },
  ) => {
    if (!tournament) return;

    const bracket: EliminationBracket | null =
      tournament.format === "single-elim" || tournament.format === "series-bracket"
        ? tournament.bracket
        : tournament.format === "group-knockout"
          ? tournament.knockout
          : null;

    if (!bracket) return;

    const hadChampionBefore = Boolean(
      bracket.rounds.at(-1)?.matches[0]?.winner,
    );

    const newRounds = setMatchWinner(
      bracket.rounds,
      roundIndex,
      matchIndex,
      winner,
      score,
    );

    if (tournament.format === "group-knockout") {
      setTournament({ ...tournament, knockout: { rounds: newRounds } });
    } else {
      setTournament({ ...tournament, bracket: { rounds: newRounds } });
    }

    const finalWinner = newRounds.at(-1)?.matches[0]?.winner;
    if (!hadChampionBefore && finalWinner) {
      setChampion(finalWinner);
    }
  };

  const handleRecordGroupMatch = (
    groupIndex: number,
    matchIndex: number,
    score: { participant1: number; participant2: number },
  ) => {
    if (!tournament || tournament.format !== "group-knockout") return;

    const groups = tournament.groupStage.groups.map((group, i) =>
      i === groupIndex
        ? recordGroupMatchResult(group, matchIndex, score)
        : group,
    );

    setTournament({
      ...tournament,
      groupStage: { ...tournament.groupStage, groups },
    });
  };

  const handleCreateKnockout = () => {
    if (
      !tournament ||
      tournament.format !== "group-knockout" ||
      tournament.knockout
    ) {
      return;
    }

    try {
      const knockout = generateKnockoutFromGroups(tournament.groupStage);
      setTournament({ ...tournament, knockout });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create knockout bracket.");
    }
  };

  // =======================
  // RENDER
  // =======================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar active={activeFormat} onSelect={handleSelectTab} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* =======================
            SETUP MODE
        ======================= */}
        {!tournament && (
          <>
            {activeFormat === "single-elim" && (
              <SingleElimSetup
                key={activeFormat}
                onSubmit={handleCreate}
                error={error}
              />
            )}
            {activeFormat === "series-bracket" && (
              <SeriesSetup
                key={activeFormat}
                onSubmit={handleCreate}
                error={error}
              />
            )}
            {activeFormat === "group-knockout" && (
              <GroupKnockoutSetup
                key={activeFormat}
                onSubmit={handleCreate}
                error={error}
              />
            )}
          </>
        )}

        {/* =======================
            RESULT MODE
        ======================= */}
        {tournament && (
          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">
                  {tournament.name}
                </h2>
                {tournament.description && (
                  <p className="mt-1 text-sm text-slate-400">
                    {tournament.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="shrink-0 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-indigo-400 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {(tournament.format === "single-elim" ||
              tournament.format === "series-bracket") && (
              <BracketView
                bracket={tournament.bracket}
                onSetWinner={handleSetWinner}
              />
            )}

            {tournament.format === "group-knockout" && (
              <>
                <GroupStageView
                  groupStage={tournament.groupStage}
                  onRecordMatch={handleRecordGroupMatch}
                  onCreateKnockout={handleCreateKnockout}
                  knockoutCreated={Boolean(tournament.knockout)}
                />

                {tournament.knockout && (
                  <BracketView
                    bracket={tournament.knockout}
                    onSetWinner={handleSetWinner}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {champion && (
        <ChampionModal champion={champion} onClose={() => setChampion(null)} />
      )}
    </div>
  );
}

export default App;
