"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

type Workout = { day: number; workout: string };

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [plan, setPlan] = useState<Workout[]>([]);
  const [status, setStatus] = useState("");

  // Initialiser bruger og profil
  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);

        const { data: profile } = await supabase
          .from("profiles")
          .select("training_level")
          .eq("id", data.user.id)
          .single();

        if (profile) {
          setLevel(profile.training_level);
          loadPlan(profile.training_level);
        }
      }
    }
    init();
  }, []);

  async function loadPlan(level: string) {
    const res = await fetch(`/api/plan?training_level=${level}`);
    const data = await res.json();
    setPlan(data.plan);
  }

  async function signup() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setStatus(error.message);
    if (data.user) {
      setUser(data.user);
      setStatus("Konto oprettet ✅");
    }
  }

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setStatus(error.message);
    if (data.user) {
      setUser(data.user);
      setStatus("Login succes ✅");

      const { data: profile } = await supabase
        .from("profiles")
        .select("training_level")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setLevel(profile.training_level);
        loadPlan(profile.training_level);
      }
    }
  }

  async function chooseLevel(level: string) {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, training_level: level })
      .select()
      .single();

    if (error) {
      setStatus(error.message);
    }
    if (data) {
      setLevel(data.training_level);
      setStatus(`Du har valgt: ${data.training_level}`);
      loadPlan(data.training_level);
    }
  }

  return (
    <main className="p-8 text-center font-sans">
      <h1 className="text-4xl font-bold text-primary">VelociCoach 🚴</h1>
      <p className="text-accent">Dette er accentfarven (gul)</p>

      {!user ? (
        <div className="mb-8">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 m-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 m-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button
              onClick={signup}
              className="bg-green-500 text-white px-4 py-2 m-2 rounded"
            >
              Opret bruger
            </button>
            <button
              onClick={login}
              className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
            >
              Log ind
            </button>
          </div>
          <p>{status}</p>
        </div>
      ) : !level ? (
        <>
          <p>Vælg dit niveau:</p>
          <button
            onClick={() => chooseLevel("begynder")}
            className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
          >
            Begynder
          </button>
          <button
            onClick={() => chooseLevel("motion")}
            className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
          >
            Motion
          </button>
          <button
            onClick={() => chooseLevel("licens")}
            className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
          >
            Licensrytter
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">{status}</p>
          <h2 className="text-2xl font-bold mb-2">Din ugeplan</h2>
          <ul className="text-left max-w-md mx-auto">
            {plan.map((p) => (
              <li key={p.day} className="border-b py-2">
                Dag {p.day}: {p.workout}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p>Vil du ændre niveau?</p>
            <button
              onClick={() => chooseLevel("begynder")}
              className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
            >
              Begynder
            </button>
            <button
              onClick={() => chooseLevel("motion")}
              className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
            >
              Motion
            </button>
            <button
              onClick={() => chooseLevel("licens")}
              className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
            >
              Licensrytter
            </button>
          </div>
        </>
      )}
    </main>
  );
}
