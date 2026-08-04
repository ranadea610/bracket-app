export type LbRoundFeeder =
  | { type: "wb-losers-paired"; wbRoundIndex: number }
  | { type: "lb-winners-paired"; lbRoundIndex: number }
  | { type: "lb-winners-vs-wb-losers"; lbRoundIndex: number; wbRoundIndex: number };

export type LbRoundPlan = {
  size: number;
  feeder: LbRoundFeeder;
};

/**
 * Plans the losers-bracket round shape for a `participantCount`-size
 * double-elim bracket. Single source of truth for LB structure, used by
 * both the generator and the cross-bracket advancement logic so they can
 * never disagree.
 *
 * Round 0 pairs WB round 0's losers against each other (mirrored: match j =
 * loser of WB match j vs loser of WB match losersCount-1-j, which delays an
 * immediate rematch of the round-0 pairing). Every WB round after that
 * contributes a "drop-in" LB round (that round's LB survivors vs the new WB
 * losers), followed by a "survivors only" LB round pairing those drop-in
 * winners against each other — except after the final WB round, since there
 * are no more survivors to pair up afterward (that drop-in round's winner is
 * the LB champion).
 */
export function planLosersBracket(participantCount: number): LbRoundPlan[] {
  const wbRoundCount = Math.log2(participantCount);
  const plan: LbRoundPlan[] = [];

  plan.push({
    size: participantCount / 4,
    feeder: { type: "wb-losers-paired", wbRoundIndex: 0 },
  });

  for (let wbRoundIndex = 1; wbRoundIndex < wbRoundCount; wbRoundIndex++) {
    const prevLbRoundIndex = plan.length - 1;
    const dropInSize = plan[prevLbRoundIndex].size;

    plan.push({
      size: dropInSize,
      feeder: {
        type: "lb-winners-vs-wb-losers",
        lbRoundIndex: prevLbRoundIndex,
        wbRoundIndex,
      },
    });

    if (wbRoundIndex < wbRoundCount - 1) {
      plan.push({
        size: dropInSize / 2,
        feeder: { type: "lb-winners-paired", lbRoundIndex: plan.length - 1 },
      });
    }
  }

  return plan;
}
