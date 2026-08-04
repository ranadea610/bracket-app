import type { ParticipantSlot } from "../participants/slots";
import type { ParticipantGroup } from "../participants/GroupedParticipantList";
import type { TournamentFormat } from "../../tournament/types";

export type SingleElimDraft = {
  format: "single-elim";
  name: string;
  description: string;
  size: number | null;
  participants: ParticipantSlot[];
};

export type SeriesDraft = {
  format: "series-bracket";
  name: string;
  description: string;
  size: number | null;
  bestOf: number | null;
  participants: ParticipantSlot[];
};

export type GroupKnockoutDraft = {
  format: "group-knockout";
  name: string;
  description: string;
  numGroups: number | null;
  groupSize: number | null;
  advancePerGroup: number | null;
  groups: ParticipantGroup[];
};

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

export function createEmptyDraft(format: TournamentFormat): Draft {
  switch (format) {
    case "single-elim":
      return { format, name: "", description: "", size: null, participants: [] };
    case "series-bracket":
      return {
        format,
        name: "",
        description: "",
        size: null,
        bestOf: null,
        participants: [],
      };
    case "group-knockout":
      return {
        format,
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
