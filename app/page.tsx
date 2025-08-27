"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  // Når siden loader → hent eller opret user_id
  useEffect(() => {
    let id = localStorage.getItem("user_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("user_id", id);
    }
    setUserId(id);

    // Hent eksisterende valg hvis det findes
    fetch(`/api/user?user_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.training_level) {
          setLevel(data.training_level);
          setStatus(`Du har valgt: ${data.training_level}`);
        }
      });
  }, []);

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
        <p>{status}</p>
      )}
    </main>
  );
}
