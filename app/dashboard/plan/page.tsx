"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PlanDay = {
  id: number;
  training_level: string;
  day: number;
  workout: string;
};

export default function PlanPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [planDays, setPlanDays] = useState<{ date: Date; workout: string }[]>(
    []
  );
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
        const { data: userPlans, error: userPlanError } = await supabase
          .from("user_plans")
          .select("plan_id, start_date")
          .eq("user_id", auth.user.id)
          .limit(1);

        if (userPlanError) throw userPlanError;
        if (!userPlans || userPlans.length === 0) {
          setPlanDays([]);
          setLoading(false);
          return;
        }

        const { plan_id, start_date } = userPlans[0];

        // 2. Hent plan-dage
        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("day, workout")
          .eq("id", plan_id);

        if (planError) throw planError;

        // 3. Beregn datoer
        if (planData) {
          const start = new Date(start_date);
          const mapped = planData.map((p: PlanDay) => {
            const d = new Date(start);
            d.setDate(start.getDate() + p.day);
            return { date: d, workout: p.workout };
          });
          setPlanDays(mapped);
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
        <p className="text-neutral">Indlæser plan...</p>
      </main>
    );
  }

  if (!planDays.length) {
    return (
      <main className="flex min-h-screen bg-neutral-light p-6">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Din træningsplan
          </h1>
          <p className="text-neutral-dark">
            Du har endnu ikke valgt en plan.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-neutral-light p-6">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Din træningsplan
        </h1>
        <ul className="divide-y divide-neutral-light">
          {planDays.map((p, i) => (
            <li key={i} className="py-3 flex justify-between">
              <span className="font-medium text-neutral-dark">
                {p.date.toLocaleDateString("da-DK")}
              </span>
              <span className="text-neutral">{p.workout}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
