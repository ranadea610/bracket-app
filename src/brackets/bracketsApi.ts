import { supabase } from "../lib/supabaseClient";
import type { Tournament, TournamentFormat } from "../tournament/types";
import type { SavedBracket } from "./types";

type BracketRow = {
  id: string;
  name: string;
  format: TournamentFormat;
  tournament: Tournament;
  updated_at: string;
};

function rowToSavedBracket(row: BracketRow): SavedBracket {
  return {
    id: row.id,
    name: row.name,
    format: row.format,
    tournament: row.tournament,
    updatedAt: row.updated_at,
  };
}

export async function saveBracket(
  userId: string,
  tournament: Tournament,
): Promise<{ error?: string }> {
  const { error } = await supabase.from("brackets").upsert({
    id: tournament.id,
    user_id: userId,
    name: tournament.name,
    format: tournament.format,
    tournament,
    updated_at: new Date().toISOString(),
  });
  return error ? { error: error.message } : {};
}

export async function listBrackets(userId: string): Promise<SavedBracket[]> {
  const { data, error } = await supabase
    .from("brackets")
    .select("id, name, format, tournament, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as BracketRow[]).map(rowToSavedBracket);
}

export async function deleteBracket(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from("brackets").delete().eq("id", id);
  return error ? { error: error.message } : {};
}
