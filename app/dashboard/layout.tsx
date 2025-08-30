"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/plan", label: "Plan" },
  { href: "/dashboard/history", label: "Historik" },
  { href: "/dashboard/stats", label: "Analyse" },
  { href: "/dashboard/profile", label: "Profil" },
  { href: "/dashboard/trainer", label: "Personal Trainer" },
  { href: "/dashboard/community", label: "Coffee Stop" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-neutral-light">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-black text-white p-6 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-6">VelociCoach</h2>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-neutral-dark text-accent font-semibold"
                    : "hover:text-accent"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Log ud knap nederst */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full bg-accent text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition"
          >
            Log ud
          </button>
        </div>
      </aside>

      {/* Burger-menu til mobil */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 text-white bg-black p-2 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Main content */}
      <main className="flex-1 p-8 md:ml-64">{children}</main>
    </div>
  );
}
