"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for de data vi faktisk får fra Supabase
type PlanDayView = {
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
          .select("template_id, start_date") // <-- rettet felt (ikke plan_id)
          .eq("user_id", auth.user.id)
          .limit(1);

        if (userPlanError) throw userPlanError;
        if (!userPlans || userPlans.length === 0) {
          setPlanDays([]);
          setLoading(false);
          return;
        }

        const { template_id, start_date } = userPlans[0];

        // 2. Hent plan-dage (alle workouts for den valgte template)
        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("day, workout")
          .eq("template_id", template_id);

        if (planError) throw planError;

        // 3. Beregn datoer
        if (planData) {
          const start = new Date(start_date);
          const mapped = (planData as PlanDayView[]).map((p) => {
            const d = new Date(start);
            d.setDate(start.getDate() + p.day);
            return { date: d, workout: p.workout };
          });
          setPlanDays(mapped);
        }
      } catch
