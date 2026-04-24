// This is the homepage for StudyArena.
// In Next.js, this file controls the "/" route.
// That means when you visit http://localhost:3000,
// this component is what appears on the screen.

export default function Home() {
  // The return statement contains the UI for this page.
  // React uses JSX/TSX, which looks like HTML inside JavaScript/TypeScript.
  return (
    // <main> is the main wrapper for the whole page.
    // className uses Tailwind CSS classes for styling.
    // min-h-screen = full screen height
    // bg-slate-950 = dark background
    // text-white = white text
    <main
        className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
        style={{
      backgroundImage: "url('/images/study-arena-bg.png')",
      backgroundPosition: "center 65%",
    }}
    >
  <section className="flex min-h-screen flex-col items-center justify-center bg-slate-950/25 px-6 text-center">
        {/* Small badge above the title */}
        <p className="mb-4 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-cyan-300">
          Welcome to the arena
        </p>

        {/* Main app title */}
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          StudyArena
        </h1>

        {/* Short pitch for the app/game */}
        <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
          An avatar-based open world where students battle, rank up, earn coins,
          and unlock rewards by mastering real subjects.
        </p>

        {/* Button group */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {/* Later this button will take users into the open world/plaza */}
          <button className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
            Enter the Plaza
          </button>

          {/* Later this button can scroll to or open game modes */}
          <button className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
            View Game Modes
          </button>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          {/* Feature card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Open World</h2>
            <p className="mt-3 text-slate-400">
              Walk around the plaza, meet players, and enter subject arenas.
            </p>
          </div>

          {/* Feature card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Ranked Battles</h2>
            <p className="mt-3 text-slate-400">
              Compete solo, with friends, or against random players.
            </p>
          </div>

          {/* Feature card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Earn Rewards</h2>
            <p className="mt-3 text-slate-400">
              Gain XP, coins, clothes, badges, titles, and subject-based ranks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
