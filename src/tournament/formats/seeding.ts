/**
 * Classic recursive tournament bracket seeding. order(2) = [1, 2]; order(2n)
 * is built by replacing each seed `s` in order(n) with the pair
 * [s, 2n + 1 - s]. This guarantees seed 1 and 2 can't meet before the final,
 * 1-4 can't meet before the semifinal, and so on, for any power-of-2 size.
 */
export function standardSeedOrder(size: number): number[] {
  let order = [1, 2];

  while (order.length < size) {
    const n = order.length;
    const next: number[] = [];
    for (const seed of order) {
      next.push(seed, 2 * n + 1 - seed);
    }
    order = next;
  }

  return order;
}

/**
 * Reorders an already-seed-ordered list (index 0 = seed 1, etc.) into
 * standard bracket order, so that plain adjacent pairing (as
 * buildEliminationRounds does) produces correct tournament seeding.
 */
export function reseedForBracket<T>(participants: T[]): T[] {
  return standardSeedOrder(participants.length).map((seed) => participants[seed - 1]);
}
