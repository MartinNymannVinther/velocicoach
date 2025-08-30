import { createClient } from "@supabase/supabase-js";

// Init supabase client (du kan evt. flytte det til en fælles lib/supabase.ts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typedef for et træningspas
export type TrainingSession = {
  id: string;
  user_id: string;
  source: "manual" | "strava" | "garmin" | "trainingpeaks";
  external_id?: string | null;
  date: string;
  type?: string | null;
  duration?: string | null;
  distance?: number | null;
  avg_power?: number | null;
  avg_hr?: number | null;
  calories?: number | null;
  created_at?: string;
};

// 1️⃣ Hent alle træningspas for en bruger
export async function getTrainingSessions(userId: string) {
  const { data, error } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data as TrainingSession[];
}

// 2️⃣ Tilføj et nyt træningspas (manuel indtastning)
export async function addTrainingSession(
  userId: string,
  session: Omit<TrainingSession, "id" | "user_id" | "created_at">
) {
  const { data, error } = await supabase
    .from("training_sessions")
    .insert([
      {
        ...session,
        user_id: userId,
        source: session.source || "manual",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as TrainingSession;
}
