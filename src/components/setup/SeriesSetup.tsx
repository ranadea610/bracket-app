import { useState } from "react";
import { OptionDropdown } from "../OptionDropdown";
import { NumberDropdown } from "../NumberDropdown";
import { TournamentNameInput } from "../TournamentNameInput";
import { TournamentDescriptionInput } from "../TournamentDescriptionInput";
import { ParticipantList } from "../participants/ParticipantList";
import { GroupedParticipantList } from "../participants/GroupedParticipantList";
import { createParticipantSlots } from "../participants/slots";
import { resolveGroupSlot } from "../participants/groupSlot";
import { BracketPreview } from "../bracket/BracketPreview";
import type {
  EliminationBracket,
  SeriesConfig,
  WttSeriesFormat,
} from "../../tournament/types";
import { generateSeriesBracket } from "../../tournament/formats/seriesBracket";
import {
  buildNbaPlayoffsGroups,
  WTT_DRAW_SIZE,
  type SeriesDraft,
} from "./draftTypes";

const SIZES = [4, 8, 16, 32, 64, 128, 256];
const BEST_OF_OPTIONS = [3, 5, 7];

const FORMAT_OPTIONS = [
  { value: "default" as const, label: "Default" },
  { value: "nba-playoffs" as const, label: "NBA Playoffs" },
  { value: "wtt-star-contender" as const, label: "WTT Star Contender" },
  { value: "wtt-champions" as const, label: "WTT Champions" },
  { value: "wtt-grand-smash" as const, label: "WTT Grand Smash" },
];

const WTT_INFO: Record<WttSeriesFormat, string> = {
  "wtt-star-contender":
    "48 players — the top 16 seeds receive a bye into round 2. Best of 5 until the semifinals, best of 7 for the semifinals and final.",
  "wtt-champions":
    "32 players. Best of 5 until the semifinals, best of 7 for the semifinals and final.",
  "wtt-grand-smash":
    "64 players. Best of 5 until the semifinals, best of 7 for the semifinals and final.",
};

function isWttFormat(
  value: SeriesDraft["seriesFormat"],
): value is WttSeriesFormat {
  return value === "wtt-star-contender" || value === "wtt-champions" || value === "wtt-grand-smash";
}

type SeriesSetupProps = {
  draft: SeriesDraft;
  onDraftChange: (draft: SeriesDraft) => void;
  onSubmit: (config: SeriesConfig) => void;
  error: string | null;
};

export function SeriesSetup({
  draft,
  onDraftChange,
  onSubmit,
  error,
}: SeriesSetupProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { name, description } = draft;

  const handleFormatChange = (
    seriesFormat: "default" | "nba-playoffs" | WttSeriesFormat,
  ) => {
    if (seriesFormat === "default") {
      onDraftChange({
        format: "series-bracket",
        seriesFormat: "default",
        name,
        description,
        size: null,
        bestOf: null,
        participants: [],
      });
    } else if (seriesFormat === "nba-playoffs") {
      onDraftChange({
        format: "series-bracket",
        seriesFormat: "nba-playoffs",
        name,
        description,
        groups: buildNbaPlayoffsGroups(),
      });
    } else {
      onDraftChange({
        format: "series-bracket",
        seriesFormat,
        name,
        description,
        participants: createParticipantSlots(WTT_DRAW_SIZE[seriesFormat]),
      });
    }
  };

  const allNamed =
    draft.seriesFormat === "nba-playoffs"
      ? draft.groups.length > 0 &&
        draft.groups.every((g) =>
          g.participants.every((p) => p.name.trim().length > 0),
        )
      : draft.participants.length > 0 &&
        draft.participants.every((p) => p.name.trim().length > 0);

  const handleCreate = () => {
    if (!allNamed) return;

    if (draft.seriesFormat === "default") {
      if (!draft.size || !draft.bestOf) return;
      onSubmit({
        format: "series-bracket",
        seriesFormat: "default",
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants: draft.participants.map((p) => p.name.trim()),
        bestOf: draft.bestOf,
      });
    } else if (draft.seriesFormat === "nba-playoffs") {
      onSubmit({
        format: "series-bracket",
        seriesFormat: "nba-playoffs",
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants: draft.groups.flatMap((g) =>
          g.participants.map((p) => p.name.trim()),
        ),
      });
    } else {
      onSubmit({
        format: "series-bracket",
        seriesFormat: draft.seriesFormat,
        name: name.trim() || "My Tournament",
        description: description.trim() || undefined,
        participants: draft.participants.map((p) => p.name.trim()),
      });
    }
  };

  const readyForParticipants =
    (draft.seriesFormat === "default" && draft.size && draft.bestOf) ||
    draft.seriesFormat === "nba-playoffs" ||
    isWttFormat(draft.seriesFormat);

  const rawFlatNames =
    draft.seriesFormat === "nba-playoffs"
      ? draft.groups.flatMap((g) => g.participants.map((p) => p.name.trim()))
      : draft.participants.map((p) => p.name.trim());
  const flatNames = rawFlatNames.map((name, i) => name || `Participant ${i + 1}`);

  let previewBracket: EliminationBracket | null = null;
  if (showPreview && flatNames.length > 0) {
    try {
      if (draft.seriesFormat === "default" && draft.bestOf) {
        previewBracket = generateSeriesBracket({
          format: "series-bracket",
          seriesFormat: "default",
          bestOf: draft.bestOf,
          name: "",
          participants: flatNames,
        }).bracket;
      } else if (draft.seriesFormat === "nba-playoffs") {
        previewBracket = generateSeriesBracket({
          format: "series-bracket",
          seriesFormat: "nba-playoffs",
          name: "",
          participants: flatNames,
        }).bracket;
      } else if (isWttFormat(draft.seriesFormat)) {
        previewBracket = generateSeriesBracket({
          format: "series-bracket",
          seriesFormat: draft.seriesFormat,
          name: "",
          participants: flatNames,
        }).bracket;
      }
    } catch {
      previewBracket = null;
    }
  }

  const handleSwapSeeds = (seedA: number, seedB: number) => {
    if (draft.seriesFormat === "nba-playoffs") {
      const a = resolveGroupSlot(draft.groups, seedA - 1);
      const b = resolveGroupSlot(draft.groups, seedB - 1);
      const nextGroups = draft.groups.map((g) => ({
        ...g,
        participants: [...g.participants],
      }));
      const temp = nextGroups[a.groupIndex].participants[a.slotIndex];
      nextGroups[a.groupIndex].participants[a.slotIndex] =
        nextGroups[b.groupIndex].participants[b.slotIndex];
      nextGroups[b.groupIndex].participants[b.slotIndex] = temp;
      onDraftChange({ ...draft, groups: nextGroups });
    } else {
      const next = [...draft.participants];
      [next[seedA - 1], next[seedB - 1]] = [next[seedB - 1], next[seedA - 1]];
      onDraftChange({ ...draft, participants: next });
    }
  };

  return (
    <div className="space-y-6">
      <TournamentNameInput
        value={name}
        onChange={(name) => onDraftChange({ ...draft, name })}
      />

      <OptionDropdown
        label="Tournament format"
        options={FORMAT_OPTIONS}
        selected={draft.seriesFormat}
        onSelect={handleFormatChange}
      />

      {draft.seriesFormat === "default" && (
        <>
          <NumberDropdown
            label="Bracket size"
            options={SIZES}
            selected={draft.size}
            onSelect={(size) =>
              onDraftChange({ ...draft, size, participants: createParticipantSlots(size) })
            }
          />

          <NumberDropdown
            label="Series length (best of)"
            options={BEST_OF_OPTIONS}
            selected={draft.bestOf}
            onSelect={(bestOf) => onDraftChange({ ...draft, bestOf })}
          />
        </>
      )}

      {draft.seriesFormat === "nba-playoffs" && (
        <p className="text-sm text-slate-400">
          16 teams — 8 per conference, best of 7 throughout, no play-in.
        </p>
      )}

      {isWttFormat(draft.seriesFormat) && (
        <p className="text-sm text-slate-400">{WTT_INFO[draft.seriesFormat]}</p>
      )}

      {readyForParticipants && (
        <>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            {showPreview ? "Hide Bracket Preview" : "Show Bracket Preview"}
          </button>

          <div className={showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
            <div>
              {draft.seriesFormat === "nba-playoffs" ? (
                <GroupedParticipantList
                  groups={draft.groups}
                  onChange={(groups) => onDraftChange({ ...draft, groups })}
                />
              ) : (
                <ParticipantList
                  participants={draft.participants}
                  onChange={(participants) => onDraftChange({ ...draft, participants })}
                />
              )}
            </div>

            {showPreview && (
              <div>
                <BracketPreview bracket={previewBracket} onSwapSeeds={handleSwapSeeds} />
              </div>
            )}
          </div>

          <TournamentDescriptionInput
            value={description}
            onChange={(description) => onDraftChange({ ...draft, description })}
          />

          <div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!allNamed}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-indigo-500 cursor-pointer"
            >
              Create Bracket
            </button>
            {!allNamed && (
              <p className="mt-2 text-sm text-slate-500">
                Name every participant to continue
              </p>
            )}
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}
