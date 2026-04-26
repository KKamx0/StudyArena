import Link from "next/link";

// This is the public auth entry page for StudyArena.

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/study-arena-bg.png')",
        backgroundPosition: "center 65%",
      }}
    >
      <section className="flex min-h-screen flex-col items-center justify-center bg-slate-950/25 px-6 text-center">
        <h1
          className="max-w-4xl text-6xl font-extrabold tracking-tight text-white md:text-8xl"
          style={{
            textShadow: "0 4px 24px rgba(0, 0, 0, 0.95)",
          }}
        >
          StudyArena
        </h1>

        <p
          className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-white md:text-xl"
          style={{
            textShadow: "0 3px 16px rgba(0, 0, 0, 0.95)",
          }}
        >
          Log in or create an account to enter your study world.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-cyan-400 px-8 py-3 font-bold text-slate-950 shadow-lg hover:bg-cyan-300"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border border-purple-300 bg-purple-500/90 px-8 py-3 font-bold text-white shadow-lg hover:bg-purple-400"
          >
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}
