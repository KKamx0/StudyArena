"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import PhaserGame from "@/components/PhaserGame";
import { createInitialPlayerProgress } from "@/lib/progression";

export default function WorldClient() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  // This keeps XP/coins/level in client state while the player is in the world.
  // Later, we can save this progress to Supabase so it persists permanently.
  const [playerProgress, setPlayerProgress] = useState(() =>
    createInitialPlayerProgress()
  );

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

          <h1 className="mt-2 text-2xl font-black">Loading the Plaza...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <PhaserGame
        playerProgress={playerProgress}
        onPlayerProgressChange={setPlayerProgress}
      />

      <header className="absolute left-0 top-0 z-20 flex w-full flex-wrap items-start justify-between gap-3 px-6 py-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/85 px-5 py-3 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            StudyArena
          </p>

          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            The Plaza
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            {profile?.username ?? "Player"}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur">
            Coins: {playerProgress.coins}
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur">
            XP: {playerProgress.totalXp}
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur">
            Level {playerProgress.level}
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg hover:bg-cyan-300"
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-purple-400/60 bg-purple-500/90 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-400"
          >
            Logout
          </button>
        </div>
      </header>

      <footer className="absolute bottom-0 left-0 z-20 flex w-full justify-center px-6 py-5">
        <div className="flex gap-3 rounded-2xl border border-slate-700 bg-slate-900/85 p-3 shadow-2xl backdrop-blur">
          <button className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 shadow-lg hover:bg-cyan-300">
            Arenas
          </button>

          <button className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 shadow-lg hover:bg-cyan-300">
            Shop
          </button>

          <button className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 shadow-lg hover:bg-cyan-300">
            Profile
          </button>
        </div>
      </footer>
    </main>
  );
}