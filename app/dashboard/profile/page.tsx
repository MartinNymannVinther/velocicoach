"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [level, setLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Hent bruger
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);

        // Hent profil fra "profiles" tabel i Supabase
        const { data: profile } = await supabase
          .from("profiles")
          .select("level")
          .eq("id", data.user.id)
          .single();

        if (profile) {
          setLevel(profile.level || "");
        }
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, level }, { onConflict: "id" });

    if (error) {
      setMessage("❌ Der opstod en fejl ved gemning.");
    } else {
      setMessage("✅ Profil gemt!");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-neutral">Indlæser...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-light">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Din profil</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border border-neutral px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>

          {/* Niveau */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Niveau
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-lg border border-neutral px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="">Vælg niveau...</option>
              <option value="begynder">Begynder</option>
              <option value="motion">Motion</option>
              <option value="licens">Licens</option>
            </select>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Gemmer..." : "Gem profil"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-neutral-dark">{message}</p>
        )}
      </div>
    </main>
  );
}
