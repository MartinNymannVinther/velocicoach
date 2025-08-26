// app/api/hello/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Kør server-side (undgår edge-begrænsninger)
export const runtime = "nodejs";

// Brug ALDRIG NEXT_PUBLIC_ på service role nøglen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("test_messages")
      .select("text")
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: data?.[0]?.text ?? "No message found",
    });
    } catch (err) {
    if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}
