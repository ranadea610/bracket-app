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
import { computeStandings } from "../groupStandings";

export function groupName(index: number): string {
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
    const matches = generateRoundRobin(groupParticipants);

    groups.push({
      id: crypto.randomUUID(),
      name: groupName(groups.length),
      participants: groupParticipants,
      matches,
      standings: computeStandings(groupParticipants, matches),
    });
  }

  const groupStage: GroupStage = { groups, advancePerGroup };

  return {
    id: crypto.randomUUID(),
    name: config.name,
    description: config.description,
    createdAt: new Date().toISOString(),
    format: "group-knockout",
    groupStage,
    knockout: null,
  };
}

/**
 * Seeds a knockout bracket from the current standings of a group stage.
 * Takes the top `advancePerGroup` participants from each group, in group
 * order. `group.standings` is always kept sorted (see computeStandings in
 * groupStandings.ts), so this is just a slice. Throws if group play hasn't
 * produced a valid power-of-2 field of advancers.
 */
export function generateKnockoutFromGroups(
  groupStage: GroupStage,
): EliminationBracket {
  const advancers = groupStage.groups.flatMap((group) =>
    group.standings
      .slice(0, groupStage.advancePerGroup)
      .map((standing) => standing.participant),
  );

  if (!isPowerOfTwo(advancers.length)) {
    throw new Error(
      `Total advancers (${advancers.length}) must be a power of 2 to seed a knockout bracket.`,
    );
  }

  return { rounds: buildEliminationRounds(advancers) };
}
