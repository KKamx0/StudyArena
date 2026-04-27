"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  if (loading || (!user && !loading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-cyan-400/40 bg-slate-900/90 px-8 py-6 text-center shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            StudyArena
          </p>
          <h1 className="mt-2 text-2xl font-black">Loading your home...</h1>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/study-arena-bg.png')",
        backgroundPosition: "center 65%",
      }}
    >
      <section className="flex min-h-screen flex-col items-center justify-center bg-slate-950/35 px-6 py-12 text-center">
        <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
          <button
            onClick={handleLogout}
            className="absolute right-5 top-5 rounded-xl border border-purple-300 bg-purple-500/90 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-purple-400"
          >
            Logout
          </button>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300 sm:mt-0">
            StudyArena
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
            Welcome, {profile?.username ?? "Player"}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-300 md:text-lg">
            Choose where you want to go next. Your plaza, game modes, and
            profile progress are ready.
          </p>

          <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <Link
              href="/world"
              className="rounded-xl bg-cyan-400 px-6 py-3 text-center font-bold text-slate-950 shadow-lg hover:bg-cyan-300"
            >
              Enter the Plaza
            </Link>

            <button className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-lg hover:bg-cyan-300">
              View Game Modes
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3">
              Coins: {profile?.coins ?? 0}
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3">
              Level {profile?.level ?? 1}
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3">
              XP: {profile?.xp ?? 0}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}