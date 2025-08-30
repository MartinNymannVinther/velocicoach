"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PlanDay = {
  day: number;
  workout: string;
};

type TrainingSession = {
  id: string;
  date: string;
  type: string;
  duration: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<{ date: Date; workout: string }[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }
      setUser(auth.user);

      try {
        // 1. Find brugerens plan
        const { data: userPlans } = await supabase
          .from("user_plans")
          .select("plan_id, start_date")
          .eq("user_id", auth.user.id)
          .limit(1);

        if (userPlans && userPlans.length > 0) {
          const { plan_id, start_date } = userPlans[0];

          // Hent plan-dage
          const { data: planData } = await supabase
            .from("plans")
            .select("day, workout")
            .eq("id", plan_id);

          if (planData) {
            const start = new Date(start_date);
            const mapped = planData.map((p: PlanDay) => {
              const d = new Date(start);
              d.setDate(start.getDate() + p.day);
              return { date: d, workout: p.workout };
            });

            // Filtrér til kun denne uge
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay() + 1); // mandag
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // søndag

            setPlan(mapped.filter(p => p.date >= weekStart && p.date <= weekEnd));
          }
        }

        // 2. Hent sessions for denne uge
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const { data: sessionData } = await supabase
          .from("training_sessions")
          .select("*")
          .eq("user_id", auth.user.id)
          .gte("date", weekStart.toISOString())
          .lte("date", weekEnd.toISOString())
          .order("date", { ascending: true });

        if (sessionData) {
          setSessions(sessionData as TrainingSession[]);
        }
      } catch (err) {
        console.error("Fejl i loadData:", err);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-neutral">Indlæser dashboard...</p>
      </main>
    );
  }

  const planCount = plan.length;
  const doneCount = plan.filter(p =>
    sessions.some(s => new Date(s.date).toDateString() === p.date.toDateString())
  ).length;

  return (
    <main className="flex flex-col min-h-screen bg-neutral-light p-6">
      {/* Topkort */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Velkommen tilbage {user?.email}
        </h1>
        <p className="text-neutral">
          Denne uge: {planCount} planlagte pas | {doneCount} gennemført pas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ugens plan */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Ugens plan</h2>
          {plan.length === 0 ? (
            <p className="text-neutral">Ingen plan fundet.</p>
          ) : (
            <ul className="divide-y divide-neutral-light">
              {plan.map((p, i) => {
                const match = sessions.find(
                  s => new Date(s.date).toDateString() === p.date.toDateString()
                );
                return (
                  <li key={i} className="py-3 flex justify-between">
                    <span>
                      <span className="font-medium text-neutral-dark">
                        {p.date.toLocaleDateString("da-DK")}
                      </span>{" "}
                      – {p.workout}
                    </span>
                    <span>
                      {match ? "✔" : p.date < new Date() ? "✖" : "⏳"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Ugens historik */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Ugens historik</h2>
          {sessions.length === 0 ? (
            <p className="text-neutral">Ingen træninger registreret.</p>
          ) : (
            <ul className="divide-y divide-neutral-light">
              {sessions.map((s) => (
                <li key={s.id} className="py-3 flex justify-between">
                  <span>
                    <span className="font-medium text-neutral-dark">
                      {new Date(s.date).toLocaleDateString("da-DK")}
                    </span>{" "}
                    – {s.type ?? "Ukendt type"}
                  </span>
                  <span>{s.duration ?? "-"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
