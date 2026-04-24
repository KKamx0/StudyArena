import Link from "next/link";

// This file creates the /world page.
// This is the full-screen StudyArena plaza page.
// Later, the Phaser open-world game canvas will replace the temporary background/placeholder.

export default function WorldPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Temporary full-screen game-world background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900" />

      {/* Soft glowing arena effect */}
      <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      {/* Top HUD */}
      <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between px-6 py-4">
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

      {/* Full-screen game canvas placeholder */}
      <section className="relative z-0 flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          {/* Temporary avatar placeholder */}
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-cyan-300 bg-slate-900 text-5xl shadow-2xl">
            🧍
          </div>

          <h2
            className="text-5xl font-extrabold tracking-tight text-white md:text-7xl"
            style={{
              textShadow: "0 4px 24px rgba(0, 0, 0, 0.95)",
            }}
          >
            Open World Canvas
          </h2>

          <p
  className="mx-auto mt-5 max-w-2xl text-center text-lg font-semibold leading-relaxed text-slate-200 md:text-xl"
  style={{
    textShadow: "0 3px 16px rgba(0, 0, 0, 0.95)",
  }}
>
  This full-screen area will become the playable plaza where avatars walk
  around, meet other players, enter arenas, and visit shops.
</p>
        </div>
      </section>

      {/* Bottom game menu */}
      <footer className="absolute bottom-0 left-0 z-10 flex w-full justify-center px-6 py-5">
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