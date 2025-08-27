"use client";

import { useState, useEffect } from "react";
import Hero from "./components/Hero";

type Workout = { day: number; workout: string };

export default function Home() {
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [plan, setPlan] = useState<Workout[]>([]);

  useEffect(() => {
    let id = localStorage.getItem("user_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("user_id", id);
    }
    setUserId(id);

    fetch(`/api/user?user_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.training_level) {
          setLevel(data.training_level);
          setStatus(`Du har valgt: ${data.training_level}`);
        }
      });
  }, []);

  useEffect(() => {
    if (level) {
      fetch(`/api/plan?training_level=${level}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.plan) setPlan(data.plan);
        });
    }
  }, [level]);

  async function chooseLevel(level: string) {
    if (!userId) return;
    setStatus("Gemmer...");
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, training_level: level }),
    });
    const data = await res.json();
    if (res.ok) {
      setLevel(data.user.training_level);
      setStatus(`Du har valgt: ${data.user.training_level}`);
    } else {
      setStatus(`Fejl: ${data.error}`);
    }
  }

  return (
    <main>
      <Hero />
      <section id="onboarding" className="p-8 text-center">
        {!level ? (
          <>
            <p className="mb-4">Vælg dit niveau:</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
              onClick={() => chooseLevel("begynder")}
            >
              Begynder
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
              onClick={() => chooseLevel("motion")}
            >
              Motion
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 m-2 rounded"
              onClick={() => chooseLevel("licens")}
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
                  <span className="font-semibold">Dag {p.day}:</span> {p.workout}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
