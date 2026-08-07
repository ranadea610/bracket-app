const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function isValidUsername(username: string): boolean {
  return (
    username.length >= 3 &&
    username.length <= 15 &&
    USERNAME_PATTERN.test(username)
  );
}

/** Supabase Auth is email-based; usernames are mapped to a fake internal email under the hood. */
export function usernameToEmail(username: string): string {
  return `${username.toLowerCase()}@users.bracketapp.com`;
}
