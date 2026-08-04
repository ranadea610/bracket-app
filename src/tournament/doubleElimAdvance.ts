import { propagateAdvancement } from "./advance";
import { planLosersBracket } from "./formats/doubleElimStructure";
import type { Match, Participant, Round } from "./types";

type Score = { participant1: number; participant2: number };

export type DoubleElimBrackets = {
  winnersRounds: Round[];
  losersRounds: Round[];
  grandFinalsRounds: Round[];
};

export type DoubleElimBracketKind = "winners" | "losers" | "grandFinals";

function cloneRounds(rounds: Round[]): Round[] {
  return rounds.map((round) => ({
    ...round,
    matches: round.matches.map((match) => ({ ...match })),
  }));
}

function getLoser(match: Match | undefined): Participant | undefined {
  if (!match?.winner || !match.participant1 || !match.participant2) {
    return undefined;
  }
  return match.winner.id === match.participant1.id
    ? match.participant2
    : match.participant1;
}

function applyFeeder(
  match: Match,
  participant1: Participant | undefined,
  participant2: Participant | undefined,
) {
  if (
    match.participant1?.id !== participant1?.id ||
    match.participant2?.id !== participant2?.id
  ) {
    match.participant1 = participant1;
    match.participant2 = participant2;
    match.winner = undefined;
    match.score = undefined;
  }
}

/** Re-derives every LB round's participants from WB losers and LB survivors. */
function propagateLosersBracket(
  winnersRounds: Round[],
  losersRounds: Round[],
): Round[] {
  const participantCount = winnersRounds[0].matches.length * 2;
  const plan = planLosersBracket(participantCount);

  for (let i = 0; i < losersRounds.length; i++) {
    const { feeder } = plan[i];
    const matches = losersRounds[i].matches;

    for (let j = 0; j < matches.length; j++) {
      if (feeder.type === "wb-losers-paired") {
        const wbMatches = winnersRounds[feeder.wbRoundIndex].matches;
        applyFeeder(
          matches[j],
          getLoser(wbMatches[j]),
          getLoser(wbMatches[wbMatches.length - 1 - j]),
        );
      } else if (feeder.type === "lb-winners-paired") {
        const prevMatches = losersRounds[feeder.lbRoundIndex].matches;
        applyFeeder(
          matches[j],
          prevMatches[2 * j]?.winner,
          prevMatches[2 * j + 1]?.winner,
        );
      } else {
        const prevMatches = losersRounds[feeder.lbRoundIndex].matches;
        const wbMatches = winnersRounds[feeder.wbRoundIndex].matches;
        applyFeeder(matches[j], prevMatches[j]?.winner, getLoser(wbMatches[j]));
      }
    }
  }

  return losersRounds;
}

/** Re-derives Grand Final(s) from the WB and LB champions. */
function propagateGrandFinals(
  winnersRounds: Round[],
  losersRounds: Round[],
  grandFinalsRounds: Round[],
): Round[] {
  const wbChampion = winnersRounds.at(-1)?.matches[0]?.winner;
  const lbChampion = losersRounds.at(-1)?.matches[0]?.winner;

  const gf1 = grandFinalsRounds[0].matches[0];
  applyFeeder(gf1, wbChampion, lbChampion);

  const gf2 = grandFinalsRounds[1].matches[0];

  if (gf1.winner && wbChampion && gf1.winner.id === wbChampion.id) {
    // WB champion won outright -- tournament over, no reset needed.
    applyFeeder(gf2, undefined, undefined);
  } else if (gf1.winner && lbChampion && gf1.winner.id === lbChampion.id) {
    // LB champion won game 1 -- both now have one loss, force a reset match.
    applyFeeder(gf2, wbChampion, lbChampion);
  } else {
    applyFeeder(gf2, undefined, undefined);
  }

  return grandFinalsRounds;
}

export function getChampion(grandFinalsRounds: Round[]): Participant | null {
  const gf1 = grandFinalsRounds[0].matches[0];
  const gf2 = grandFinalsRounds[1].matches[0];

  if (gf1.winner && gf1.participant1 && gf1.winner.id === gf1.participant1.id) {
    return gf1.winner;
  }
  if (gf2.winner) {
    return gf2.winner;
  }
  return null;
}

export function setDoubleElimWinner(
  brackets: DoubleElimBrackets,
  bracketKind: DoubleElimBracketKind,
  roundIndex: number,
  matchIndex: number,
  winner: Participant,
  score?: Score,
): DoubleElimBrackets & { champion: Participant | null } {
  let winnersRounds = cloneRounds(brackets.winnersRounds);
  let losersRounds = cloneRounds(brackets.losersRounds);
  let grandFinalsRounds = cloneRounds(brackets.grandFinalsRounds);

  if (bracketKind === "winners") {
    winnersRounds[roundIndex].matches[matchIndex].winner = winner;
    winnersRounds[roundIndex].matches[matchIndex].score = score;
    winnersRounds = propagateAdvancement(winnersRounds);
  } else if (bracketKind === "losers") {
    losersRounds[roundIndex].matches[matchIndex].winner = winner;
    losersRounds[roundIndex].matches[matchIndex].score = score;
  } else {
    grandFinalsRounds[roundIndex].matches[matchIndex].winner = winner;
    grandFinalsRounds[roundIndex].matches[matchIndex].score = score;
  }

  losersRounds = propagateLosersBracket(winnersRounds, losersRounds);
  grandFinalsRounds = propagateGrandFinals(
    winnersRounds,
    losersRounds,
    grandFinalsRounds,
  );

  return {
    winnersRounds,
    losersRounds,
    grandFinalsRounds,
    champion: getChampion(grandFinalsRounds),
  };
}
