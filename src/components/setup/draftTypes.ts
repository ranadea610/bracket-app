import type { ParticipantSlot } from "../participants/slots";
import { createParticipantSlots } from "../participants/slots";
import type { ParticipantGroup } from "../participants/GroupedParticipantList";
import type { TournamentFormat, WttSeriesFormat } from "../../tournament/types";
import { groupName } from "../../tournament/formats/groupKnockout";
import { WTT_DRAW_SIZE } from "../../tournament/formats/seriesBracket";

export type DefaultSingleElimDraft = {
  format: "single-elim";
  bracketFormat: "default";
  name: string;
  description: string;
  size: number | null;
  participants: ParticipantSlot[];
};

export type MarchMadnessDraft = {
  format: "single-elim";
  bracketFormat: "march-madness";
  name: string;
  description: string;
  groups: ParticipantGroup[];
};

export type SingleElimDraft = DefaultSingleElimDraft | MarchMadnessDraft;

export type DefaultSeriesDraft = {
  format: "series-bracket";
  seriesFormat: "default";
  name: string;
  description: string;
  size: number | null;
  bestOf: number | null;
  participants: ParticipantSlot[];
};

export type NbaPlayoffsDraft = {
  format: "series-bracket";
  seriesFormat: "nba-playoffs";
  name: string;
  description: string;
  groups: ParticipantGroup[];
};

export type WttSeriesDraft = {
  format: "series-bracket";
  seriesFormat: WttSeriesFormat;
  name: string;
  description: string;
  participants: ParticipantSlot[];
};

export type SeriesDraft = DefaultSeriesDraft | NbaPlayoffsDraft | WttSeriesDraft;

export type DefaultGroupKnockoutDraft = {
  format: "group-knockout";
  groupFormat: "default";
  name: string;
  description: string;
  numGroups: number | null;
  groupSize: number | null;
  advancePerGroup: number | null;
  groups: ParticipantGroup[];
};

export type WorldCupDraft = {
  format: "group-knockout";
  groupFormat: "world-cup";
  name: string;
  description: string;
  groups: ParticipantGroup[];
};

export type GroupKnockoutDraft = DefaultGroupKnockoutDraft | WorldCupDraft;

export type DoubleElimDraft = {
  format: "double-elim";
  name: string;
  description: string;
  size: number | null;
  participants: ParticipantSlot[];
};

export type Draft =
  | SingleElimDraft
  | SeriesDraft
  | GroupKnockoutDraft
  | DoubleElimDraft;

function buildGroups(labels: string[], groupSize: number): ParticipantGroup[] {
  return labels.map((label) => ({
    id: crypto.randomUUID(),
    label,
    participants: createParticipantSlots(groupSize),
  }));
}

export function buildNbaPlayoffsGroups(): ParticipantGroup[] {
  return buildGroups(["Eastern Conference", "Western Conference"], 8);
}

export function buildMarchMadnessGroups(): ParticipantGroup[] {
  return buildGroups(["East", "West", "South", "Midwest"], 16);
}

export function buildWorldCupGroups(): ParticipantGroup[] {
  return buildGroups(
    Array.from({ length: 12 }, (_, i) => groupName(i)),
    4,
  );
}

export { WTT_DRAW_SIZE };

export function createEmptyDraft(format: TournamentFormat): Draft {
  switch (format) {
    case "single-elim":
      return {
        format,
        bracketFormat: "default",
        name: "",
        description: "",
        size: null,
        participants: [],
      };
    case "series-bracket":
      return {
        format,
        seriesFormat: "default",
        name: "",
        description: "",
        size: null,
        bestOf: null,
        participants: [],
      };
    case "group-knockout":
      return {
        format,
        groupFormat: "default",
        name: "",
        description: "",
        numGroups: null,
        groupSize: null,
        advancePerGroup: null,
        groups: [],
      };
    case "double-elim":
      return { format, name: "", description: "", size: null, participants: [] };
  }
}
