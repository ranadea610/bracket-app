import type { Group, GroupStanding, Match, Participant } from "./types";

/**
 * Tallies points (3 win / 1 draw / 0 loss) and goal stats from every match
 * that has a score, then sorts by points -> goal difference -> goals scored
 * -> name -> stable/arbitrary. This is the single sort implementation the
 * whole app uses for standings display and knockout seeding, so they can
 * never disagree.
 */
export function computeStandings(
  participants: Participant[],
  matches: Match[],
): GroupStanding[] {
  const standings = new Map<string, GroupStanding>(
    participants.map((participant) => [
      participant.id,
      {
        participant,
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      },
    ]),
  );

  for (const match of matches) {
    if (!match.score || !match.participant1 || !match.participant2) continue;

    const s1 = standings.get(match.participant1.id);
    const s2 = standings.get(match.participant2.id);
    if (!s1 || !s2) continue;

    const { participant1: score1, participant2: score2 } = match.score;

    s1.played++;
    s2.played++;
    s1.goalsFor += score1;
    s1.goalsAgainst += score2;
    s2.goalsFor += score2;
    s2.goalsAgainst += score1;

    if (score1 > score2) {
      s1.wins++;
      s1.points += 3;
      s2.losses++;
    } else if (score2 > score1) {
      s2.wins++;
      s2.points += 3;
      s1.losses++;
    } else {
      s1.draws++;
      s2.draws++;
      s1.points += 1;
      s2.points += 1;
    }
  }

  return [...standings.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;

    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;

    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    return a.participant.name.localeCompare(b.participant.name);
  });
}

export function recordGroupMatchResult(
  group: Group,
  matchIndex: number,
  score: { participant1: number; participant2: number },
): Group {
  const matches = group.matches.map((match) => ({ ...match }));
  const match = matches[matchIndex];

  match.score = score;
  match.winner =
    score.participant1 > score.participant2
      ? match.participant1
      : score.participant2 > score.participant1
        ? match.participant2
        : undefined;

  return {
    ...group,
    matches,
    standings: computeStandings(group.participants, matches),
  };
}
