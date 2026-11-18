"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function Login() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="mx-auto max-w-md px-6 pt-16">
      <h1 className="text-4xl font-extrabold">Admin log in</h1>
      <form action={action} className="mt-6 space-y-4">
        <label className="block font-semibold">Admin token
          <input name="token" type="password" required autoFocus
            className="mt-1 w-full rounded-lg border-2 border-ink/20 bg-white px-3 py-2" />
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-100 px-4 py-2 text-red-800">{error}</p>}
        <button disabled={pending} className="rounded-full bg-signal px-6 py-2.5 font-semibold text-white disabled:opacity-60">
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}