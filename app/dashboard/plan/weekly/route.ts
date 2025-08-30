import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typing af vores view (tilpas felterne efter din DB)
type WeeklyPlan = {
  user_id: string;
  week_start: string; // ISO date string
  summary: Record<string, unknown>;
  days: Array<{
    date: string;
    workout: string;
    status: "✔" | "✖" | "⏳";
  }>;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id query parameter" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_plan_weekly_json")
      .select("*")
      .eq("user_id", userId)
      .order("week_start", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Cast til vores type
    return NextResponse.json(data as WeeklyPlan[], { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
