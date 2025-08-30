"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function StatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-neutral">Indlæser statistik...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-neutral-light p-6">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">Statistik</h1>
        <p className="text-neutral-dark">
          Her vil du kunne se grafer og analyser af dine træningsdata.
        </p>
        <ul className="mt-4 list-disc list-inside text-neutral">
          <li>Samlet træningstid</li>
          <li>Ugentlig progression</li>
          <li>Snit på watt / hastighed</li>
          <li>Top-præstationer</li>
        </ul>
        <p className="mt-6 text-sm text-neutral">
          (Dummy-indhold – rigtig integration med Supabase/Strava kommer senere)
        </p>
      </div>
    </main>
  );
}
