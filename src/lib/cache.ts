import { supabase } from "./supabase";

export async function getCachedReport(filtersHash: string) {
  const { data } = await supabase
    .from("subreddit_reports")
    .select("*")
    .eq("filters_hash", filtersHash)
    .single();

  return data;
}

export async function saveReport(report: any) {
  const { data } = await supabase
    .from("subreddit_reports")
    .insert(report)
    .select()
    .single();

  return data;
}
