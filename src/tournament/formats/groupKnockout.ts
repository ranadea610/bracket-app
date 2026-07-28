import type {
  EliminationBracket,
  Group,
  GroupKnockoutConfig,
  GroupKnockoutTournament,
  GroupStage,
} from "../types";
import {
  buildEliminationRounds,
  generateRoundRobin,
  isPowerOfTwo,
  toParticipants,
} from "./shared";

function groupName(index: number): string {
  // A, B, C, ... Z, AA, AB, ...
  let n = index;
  let name = "";
  do {
    name = String.fromCharCode(65 + (n % 26)) + name;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return `Group ${name}`;
}

export function generateGroupKnockout(
  config: GroupKnockoutConfig,
): GroupKnockoutTournament {
  const { participants: names, groupSize, advancePerGroup } = config;

  if (names.length % groupSize !== 0) {
    throw new Error(
      `Number of participants (${names.length}) must be evenly divisible by group size (${groupSize}).`,
    );
  }

  const totalAdvancers = (names.length / groupSize) * advancePerGroup;
  if (!isPowerOfTwo(totalAdvancers)) {
    throw new Error(
      `Total advancers (${totalAdvancers}) across all groups must be a power of 2 to seed a knockout bracket.`,
    );
  }

  const participants = toParticipants(names);
  const groups: Group[] = [];

  for (let i = 0; i < participants.length; i += groupSize) {
    const groupParticipants = participants.slice(i, i + groupSize);

    groups.push({
      id: crypto.randomUUID(),
      name: groupName(groups.length),
      participants: groupParticipants,
      matches: generateRoundRobin(groupParticipants),
      standings: groupParticipants.map((participant) => ({
        participant,
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
      })),
    });
  }

  const groupStage: GroupStage = { groups, advancePerGroup };

  return {
    id: crypto.randomUUID(),
    name: config.name,
    createdAt: new Date().toISOString(),
    format: "group-knockout",
    groupStage,
    knockout: null,
  };
}

/**
 * Seeds a knockout bracket from the current standings of a group stage.
 * Takes the top `advancePerGroup` participants (by points, ties broken by
 * wins) from each group, in group order. Throws if group play hasn't
 * produced a valid power-of-2 field of advancers.
 */
export function generateKnockoutFromGroups(
  groupStage: GroupStage,
): EliminationBracket {
  const advancers = groupStage.groups.flatMap((group) => {
    const ranked = [...group.standings].sort(
      (a, b) => b.points - a.points || b.wins - a.wins,
    );
    return ranked
      .slice(0, groupStage.advancePerGroup)
      .map((standing) => standing.participant);
  });

  if (!isPowerOfTwo(advancers.length)) {
    throw new Error(
      `Total advancers (${advancers.length}) must be a power of 2 to seed a knockout bracket.`,
    );
  }

  return { rounds: buildEliminationRounds(advancers) };
}
