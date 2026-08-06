import type {
  EliminationBracket,
  Group,
  GroupKnockoutConfig,
  GroupKnockoutTournament,
  GroupStage,
  GroupStanding,
} from "../types";
import {
  buildEliminationRounds,
  generateRoundRobin,
  isPowerOfTwo,
  toParticipants,
  withRoundNames,
} from "./shared";
import { computeStandings, sortStandings } from "../groupStandings";
import { reseedForBracket } from "./seeding";

const WORLD_CUP_GROUP_SIZE = 4;
const WORLD_CUP_ADVANCE_PER_GROUP = 2;
const WORLD_CUP_THIRD_PLACE_ADVANCERS = 8;
const WORLD_CUP_KNOCKOUT_ROUND_NAMES = [
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

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
  const isWorldCup = config.groupFormat === "world-cup";
  const groupSize = isWorldCup ? WORLD_CUP_GROUP_SIZE : config.groupSize;
  const advancePerGroup = isWorldCup
    ? WORLD_CUP_ADVANCE_PER_GROUP
    : config.advancePerGroup;
  const thirdPlaceAdvancers = isWorldCup
    ? WORLD_CUP_THIRD_PLACE_ADVANCERS
    : undefined;

  const names = config.participants;

  if (names.length % groupSize !== 0) {
    throw new Error(
      `Number of participants (${names.length}) must be evenly divisible by group size (${groupSize}).`,
    );
  }

  if (!thirdPlaceAdvancers) {
    const totalAdvancers = (names.length / groupSize) * advancePerGroup;
    if (!isPowerOfTwo(totalAdvancers)) {
      throw new Error(
        `Total advancers (${totalAdvancers}) across all groups must be a power of 2 to seed a knockout bracket.`,
      );
    }
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

  const groupStage: GroupStage = { groups, advancePerGroup, thirdPlaceAdvancers };

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
 * order (`group.standings` is always kept sorted -- see computeStandings in
 * groupStandings.ts -- so this is just a slice). World Cup-style stages also
 * add `thirdPlaceAdvancers` more, ranked across every group's 3rd-place
 * finisher, and reseed the combined field into standard bracket order (the
 * default mode keeps its original adjacent-pairing seeding, unchanged).
 * Throws if group play hasn't produced a valid power-of-2 field of advancers.
 */
export function generateKnockoutFromGroups(
  groupStage: GroupStage,
): EliminationBracket {
  const autoAdvancers = groupStage.groups.flatMap((group) =>
    group.standings
      .slice(0, groupStage.advancePerGroup)
      .map((standing) => standing.participant),
  );

  let advancers = autoAdvancers;

  if (groupStage.thirdPlaceAdvancers) {
    const thirdPlaceStandings = groupStage.groups
      .map((group) => group.standings[groupStage.advancePerGroup])
      .filter((standing): standing is GroupStanding => Boolean(standing));

    const rankedThirds = sortStandings(thirdPlaceStandings)
      .slice(0, groupStage.thirdPlaceAdvancers)
      .map((standing) => standing.participant);

    advancers = [...autoAdvancers, ...rankedThirds];
  }

  if (!isPowerOfTwo(advancers.length)) {
    throw new Error(
      `Total advancers (${advancers.length}) must be a power of 2 to seed a knockout bracket.`,
    );
  }

  if (!groupStage.thirdPlaceAdvancers) {
    return { rounds: buildEliminationRounds(advancers) };
  }

  const seeded = reseedForBracket(advancers);
  return {
    rounds: withRoundNames(
      buildEliminationRounds(seeded),
      WORLD_CUP_KNOCKOUT_ROUND_NAMES,
    ),
  };
}
