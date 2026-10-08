import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#191b50]/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
          <KeyRound aria-hidden="true" size={22} />
        </div>

        <h1 className="text-2xl font-semibold">Password recovery</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Password reset is not available in this deployment yet. Return to sign
          in or contact your workspace administrator for help accessing your
          account.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 text-sm font-semibold transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
