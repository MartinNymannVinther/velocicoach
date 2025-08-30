"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CommunityPage() {
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
        <p className="text-neutral">Indlæser Coffee Stop...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-neutral-light p-6">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">Coffee Stop</h1>
        <p className="text-neutral-dark">
          Coffee Stop bliver vores community-rum, hvor ryttere kan udveksle erfaringer
          og heppe på hinanden.
        </p>
        <p className="mt-6 text-sm text-neutral">
          (Dummy-side – community-funktionalitet kommer i senere sprint)
        </p>
      </div>
    </main>
  );
}
