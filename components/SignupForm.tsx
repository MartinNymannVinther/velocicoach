"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Konto oprettet! Du kan nu logge ind.");
      // Du kan evt. redirecte direkte:
      // router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-sm mx-auto bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold text-neutral-dark text-center">
        Opret bruger
      </h2>

      {errorMsg && (
        <p className="text-red-500 text-sm text-center">{errorMsg}</p>
      )}
      {successMsg && (
        <p className="text-green-600 text-sm text-center">{successMsg}</p>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-dark"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-neutral px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-dark"
        >
          Adgangskode
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-neutral px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-neutral-dark font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
      >
        {loading ? "Opretter..." : "Opret konto"}
      </button>
    </form>
  );
}
