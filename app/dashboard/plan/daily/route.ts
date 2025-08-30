import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typing af vores daglige view (tilpas efter din DB)
type DailyPlan = {
  user_id: string;
  planned_date: string; // ISO date string
  workout: string;
  status: "✔" | "✖" | "⏳";
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
      .from("user_plan_overview")
      .select("*")
      .eq("user_id", userId)
      .order("planned_date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as DailyPlan[], { status: 200 });
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
