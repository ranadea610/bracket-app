/**
 * Pulls player names out of text copied from the WTT website's entry/seeding
 * list. Each player's row copies as a block of lines like:
 *
 *   Avatar
 *   Sora MATSUSHIMA
 *   JPN
 *   WR
 *   #3
 *   6298 Points
 *   Seed #1
 *
 * The literal "Avatar" line (alt text from the player's headshot image) is a
 * reliable marker immediately preceding the name, regardless of how many of
 * the optional trailing fields (seed, wildcard tag, etc.) a given row has.
 */
export function extractPlayerNames(text: string): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const names: string[] = [];

  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i] === "Avatar") {
      names.push(lines[i + 1]);
    }
  }

  return [...new Set(names)];
}
