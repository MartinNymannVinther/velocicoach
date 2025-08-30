"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    // Lyt til login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // redirect til forsiden
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white px-6 py-4 flex justify-between items-center z-50 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold hover:text-accent transition">
        VelociCoach 🚴
      </Link>

      {/* Hvis bruger er logget ind → app-mode */}
      {user ? (
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-accent text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition"
          >
            Log ud
          </button>
        </div>
      ) : (
        // Marketing-mode
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/features" className="hover:text-accent transition">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-accent transition">
            Price (It&apos;s free)
          </Link>
          <Link href="/partner-deals" className="hover:text-accent transition">
            Partner-Deals
          </Link>
          <Link href="/signup" className="hover:text-accent transition">
            Opret konto
          </Link>
          <Link
            href="/login"
            className="bg-accent text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition"
          >
            Log ind
          </Link>
        </div>
      )}
    </nav>
  );
}
