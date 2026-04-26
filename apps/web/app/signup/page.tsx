"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signUp(email, password, username);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-950/40">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
          StudyArena
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Create Account
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Choose a username, then enter the plaza with your own profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-cyan-300 transition focus:border-cyan-300 focus:ring-2"
              placeholder="arena_player"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-cyan-300 transition focus:border-cyan-300 focus:ring-2"
              placeholder="you@example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-cyan-300 transition focus:border-cyan-300 focus:ring-2"
              placeholder="At least 6 characters"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-950/40 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-cyan-300">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
