export type Participant = {
  id: string;
  name: string;
};

export type Match = {
  id: string;
  player1?: Participant;
  player2?: Participant;
  winner?: Participant;
};

export type Round = {
  roundNumber: number;
  matches: Match[];
};

export type Bracket = {
  size: number;
  rounds: Round[];
};

export function generateBracket(size: number, names: string[]): Bracket {
  // Step 1: Create participants
  const participants: Participant[] = names.map((name) => ({
    id: crypto.randomUUID(),
    name,
  }));

  const rounds: Round[] = [];

  // Step 2: Create first round
  const firstRoundMatches: Match[] = [];

  for (let i = 0; i < participants.length; i += 2) {
    firstRoundMatches.push({
      id: crypto.randomUUID(),
      player1: participants[i],
      player2: participants[i + 1],
    });
  }

  rounds.push({
    roundNumber: 1,
    matches: firstRoundMatches,
  });

  // Step 3: Create remaining rounds (empty matches)
  let matchesInRound = firstRoundMatches.length;

  let roundNumber = 2;

  while (matchesInRound > 1) {
    matchesInRound = matchesInRound / 2;

    const matches: Match[] = [];

    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: crypto.randomUUID(),
      });
    }

    rounds.push({
      roundNumber,
      matches,
    });

    roundNumber++;
  }

  return {
    size,
    rounds,
  };
}
