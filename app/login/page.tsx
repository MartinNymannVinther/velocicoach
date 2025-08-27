"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function signup() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setStatus(error.message);
    else setStatus("Konto oprettet ✅ Tjek din mail (hvis bekræftelse er påkrævet).");
  }

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus(error.message);
    else setStatus("Login succes ✅");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-primary">Log ind eller Opret</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <input
          type="password"
          placeholder="Adgangskode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />

        <div className="flex gap-2 justify-center">
          <button
            onClick={signup}
            className="bg-accent text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Opret bruger
          </button>
          <button
            onClick={login}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Log ind
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600">{status}</p>
      </div>
    </main>
  );
}
