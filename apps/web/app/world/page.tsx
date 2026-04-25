import Link from "next/link";
import PhaserGame from "@/components/PhaserGame";

// This file creates the /world page.
// This is where the playable StudyArena world loads.

export default function WorldPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Phaser game canvas */}
      <PhaserGame />

      {/* Top HUD */}
      <header className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-6 py-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/85 px-5 py-3 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            StudyArena
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            The Plaza
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur">
            Coins: 0
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur">
            Level 1
          </div>

          <Link
            href="/"
            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg hover:bg-cyan-300"
          >
            Exit
          </Link>
        </div>
      </header>

      {/* Bottom game menu */}
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