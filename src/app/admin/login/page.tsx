"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-zinc-900">
          Admin Login
        </h1>

        {state?.error && (
          <p className="text-red-600 text-center text-sm bg-red-50 rounded-lg p-3">
            {state.error}
          </p>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-zinc-900 text-white text-lg font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
