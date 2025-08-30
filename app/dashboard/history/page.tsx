"use client";

import { useEffect, useState } from "react";

type DailyPlan = {
  day: number;
  planned_date: string;
  workout: string;
  status: string;
  session_date: string | null;
  session_type: string | null;
};

type WeeklyPlan = {
  week_start: string;
  summary: {
    total: number;
    completed: number;
    missed: number;
    upcoming: number;
  };
  days: DailyPlan[];
};

export default function DashboardPage() {
  const [weekly, setWeekly] = useState<WeeklyPlan[]>([]);
  const [daily, setDaily] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "9d3cddaa-463b-41ed-ae43-d2eae0abe30f"; // TODO: hent fra auth

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weeklyRes, dailyRes] = await Promise.all([
          fetch(`/api/plan/weekly?user_id=${userId}`),
          fetch(`/api/plan/daily?user_id=${userId}`),
        ]);

        const weeklyData = await weeklyRes.json();
        const dailyData = await dailyRes.json();

        setWeekly(weeklyData);
        setDaily(dailyData);
      } catch (err) {
        console.error("Fejl ved hentning af data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-neutral">Indlæser dashboard…</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-8">
      {/* Weekly summary */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-4">Ugentligt overblik</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weekly.map((w, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-xl p-6 border border-neutral-light"
            >
              <h3 className="font-semibold mb-2">
                Uge start: {new Date(w.week_start).toLocaleDateString("da-DK")}
              </h3>
              <p className="text-sm text-neutral-dark">Planlagte pas: {w.summary.total}</p>
              <p className="text-green-600">✔ Gennemført: {w.summary.completed}</p>
              <p className="text-red-600">✖ Manglet: {w.summary.missed}</p>
              <p className="text-yellow-600">⏳ Fremtidige: {w.summary.upcoming}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily details */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-4">Dine planlagte pas</h2>
        <div className="bg-white shadow rounded-xl p-6">
          <ul className="divide-y divide-neutral-light">
            {daily.map((d, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {new Date(d.planned_date).toLocaleDateString("da-DK")}
                  </p>
                  <p className="text-sm text-neutral-dark">{d.workout}</p>
                </div>
                <span
                  className={
                    d.status.includes("✔")
                      ? "text-green-600 font-semibold"
                      : d.status.includes("✖")
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
