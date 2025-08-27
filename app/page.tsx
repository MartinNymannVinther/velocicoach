"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  type Workout = { day: number; workout: string };
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
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>VelociCoach 🚴</h1>
      {!level ? (
        <>
          <p>Vælg dit niveau:</p>
          <button onClick={() => chooseLevel("begynder")}>Begynder</button>
          <button onClick={() => chooseLevel("motion")}>Motion</button>
          <button onClick={() => chooseLevel("licens")}>Licensrytter</button>
        </>
      ) : (
        <>
          <p>{status}</p>
          <h2>Din ugeplan</h2>
          <ul>
            {plan.map((p) => (
              <li key={p.day}>
                Dag {p.day}: {p.workout}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
