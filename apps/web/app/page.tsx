import Link from "next/link";

// This is the homepage for StudyArena.
// In Next.js, this file controls the "/" route.

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/study-arena-bg.png')",
        backgroundPosition: "center 65%",
      }}
    >
      {/* Dark overlay so the text is readable over the background image */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-slate-950/25 px-6 text-center">
        {/* Main app title */}
        <h1
          className="max-w-4xl text-6xl font-extrabold tracking-tight text-white md:text-8xl"
          style={{
            textShadow: "0 4px 24px rgba(0, 0, 0, 0.95)",
          }}
        >
          StudyArena
        </h1>

        {/* Short pitch for the app/game */}
        <p
          className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-white md:text-xl"
          style={{
            textShadow: "0 3px 16px rgba(0, 0, 0, 0.95)",
          }}
        >
          An avatar-based open world where students battle, rank up, earn coins,
          and unlock rewards by mastering real subjects.
        </p>

        {/* Button group */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/world"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-cyan-300"
          >
            Enter the Plaza
          </Link>

          <button className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-cyan-300">
            View Game Modes
          </button>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-bold">Open World</h2>
            <p className="mt-3 text-slate-300">
              Walk around the plaza, meet players, and enter subject arenas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-bold">Ranked Battles</h2>
            <p className="mt-3 text-slate-300">
              Compete solo, with friends, or against random players.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-bold">Earn Rewards</h2>
            <p className="mt-3 text-slate-300">
              Gain XP, coins, clothes, badges, titles, and subject-based ranks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}