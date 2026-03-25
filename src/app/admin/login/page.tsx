"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <form
        action={formAction}
        className="bg-paper border border-line rounded-2xl shadow-sm w-full max-w-sm space-y-6 p-8 ring-1 ring-black/[0.04]"
      >
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-ink">
            Stitch-n-Stab
          </p>
          <h1 className="text-lg font-semibold text-muted mt-2">Admin sign in</h1>
        </div>

        {state?.error && (
          <p className="text-red-700 text-center text-sm bg-red-50 border border-red-100 rounded-xl p-3">
            {state.error}
          </p>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full px-4 py-3.5 border border-line rounded-xl text-lg bg-paper text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3.5 border border-line rounded-xl text-lg bg-paper text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 bg-accent text-white text-lg font-semibold rounded-xl hover:bg-accent-hover disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
