"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");

  async function chooseLevel(level: string) {
    setStatus("Gemmer...");
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ training_level: level }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`Du har valgt: ${data.user.training_level}`);
    } else {
      setStatus(`Fejl: ${data.error}`);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>VelociCoach 🚴</h1>
      <p>Vælg dit niveau:</p>
      <button onClick={() => chooseLevel("begynder")}>Begynder</button>
      <button onClick={() => chooseLevel("motion")}>Motion</button>
      <button onClick={() => chooseLevel("licens")}>Licensrytter</button>
      <p>{status}</p>
    </main>
  );
}
