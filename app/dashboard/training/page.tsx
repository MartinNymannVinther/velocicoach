"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";
import {
  getTrainingSessions,
  addTrainingSession,
  TrainingSession,
} from "@/lib/trainingSessions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TrainingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Formular-state
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState("");
  const [formDuration, setFormDuration] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);

      try {
        const result = await getTrainingSessions(data.user.id);
        setSessions(result);
      } catch (err) {
        console.error("Kunne ikke hente sessions:", err);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newSession = await addTrainingSession(user.id, {
        source: "manual",
        date: new Date(formDate).toISOString(),
        type: formType,
        duration: formDuration,
      });

      setSessions([newSession, ...sessions]);
      setShowForm(false);
      setFormDate("");
      setFormType("");
      setFormDuration("");
    } catch (err) {
      console.error("Kunne ikke tilføje session:", err);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-neutral">Indlæser træningspas...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-neutral-light p-6">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">Din træningsplan</h1>

        {/* Tilføj-knap */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-accent text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition"
          >
            + Tilføj træning
          </button>
        ) : (
          <form onSubmit={handleAddSession} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Dato
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral px-3 py-2"
              >
                <option value="">Vælg type...</option>
                <option value="Udholdenhed">Udholdenhed</option>
                <option value="Interval">Interval</option>
                <option value="Sprint">Sprint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Varighed
              </label>
              <input
                type="text"
                placeholder="fx 01:30:00"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral px-3 py-2"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Gem træning
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                Annuller
              </button>
            </div>
          </form>
        )}

        {/* Liste over sessions */}
        {sessions.length === 0 ? (
          <p className="text-neutral">Ingen træningspas fundet endnu.</p>
        ) : (
          <ul className="divide-y divide-neutral-light">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-neutral-dark">
                    {new Date(session.date).toLocaleDateString("da-DK")}
                  </p>
                  <p className="text-sm text-neutral">
                    {session.type ?? "Ukendt type"}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {session.duration ?? "-"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
