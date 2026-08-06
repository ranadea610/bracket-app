function extractPlayerNames(text: string): string[] {
  const names: string[] = [];

  // Handle the first player if it isn't in markdown
  const firstLine = text.split("\n")[0].trim();
  if (/[a-z]/.test(firstLine)) {
    names.push(firstLine);
  }

  // Match all markdown links
  const regex = /\[([^\]]+)\]\(/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const candidate = match[1].trim();

    // Player names contain at least one lowercase letter
    if (/[a-z]/.test(candidate)) {
      names.push(candidate);
    }
  }

  // Remove duplicates
  return [...new Set(names)];
}
