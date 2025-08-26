// app/api/hello/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ message: "Hello from VelociCoach API" });
}
