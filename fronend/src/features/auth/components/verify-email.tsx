"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  MailCheck,
  ArrowRight,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { useVerifyUser } from "@/features/auth/hooks/useAuthApi";

export default function VerificationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const [isResending, setIsResending] = useState(false);

  const { mutate: verify } = useVerifyUser();

  useEffect(() => {
    if (!id) return;

    verify(id as string, {
      onSuccess: () => {
        setStatus("success");

        setTimeout(() => {
          router.push("/login");
        }, 2500);
      },

      onError: () => {
        setStatus("error");
      },
    });
  }, [id, verify, router]);

  const handleResend = async () => {
    setIsResending(true);

    try {
      // TODO:
      // Call your resend verification API here.
      //
      // Example:
      // await resendVerificationEmail(email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("A new verification email has been sent!");
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      alert("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl  p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="rounded-[22px] bg-slate-950/90 px-6 py-10 text-center sm:px-10 sm:py-12">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/15 ring-1 ring-blue-500/20">
                <MailCheck className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            {/* LOADING */}
            {status === "loading" && (
              <div className="animate-in fade-in duration-500">
                {/* Loader */}
                <div className="mb-7 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />

                    <Loader2 className="relative h-14 w-14 animate-spin text-blue-400" />
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Checking your email
                </h1>

                {/* Description */}
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  We&apos;re checking your email address and confirming your
                  account. This should only take a moment.
                </p>

                {/* Inbox message */}
                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <Inbox className="h-5 w-5 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Check your inbox
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Please check your email inbox for the verification
                        link. Don&apos;t forget to check your spam or junk
                        folder too.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mx-auto mt-7 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
                </div>

                {/* Resend */}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isResending ? "animate-spin" : ""
                    }`}
                  />

                  {isResending
                    ? "Sending email..."
                    : "Resend verification email"}
                </button>

                <p className="mt-4 text-xs text-slate-600">
                  Didn&apos;t receive the email? Check your spam folder.
                </p>
              </div>
            )}

            {/* SUCCESS */}
            {status === "success" && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-7 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="h-11 w-11 text-emerald-400" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Email verified!
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Your email address has been successfully verified. Your
                  account is now active.
                </p>

                <button
                  onClick={() => router.push("/onboarding/username")}
                  className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  Continue to login

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-4 text-xs text-slate-500">
                  Redirecting automatically...
                </p>
              </div>
            )}

            {/* ERROR */}
            {status === "error" && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-7 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                    <XCircle className="h-11 w-11 text-red-400" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Verification failed
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  This verification link may be invalid, expired, or already
                  used. Please request a new verification email.
                </p>

                {/* Resend */}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isResending ? "animate-spin" : ""
                    }`}
                  />

                  {isResending
                    ? "Sending email..."
                    : "Resend verification email"}
                </button>

                {/* Home */}
                <button
                  onClick={() => router.push("/")}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  Go back home
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-10 border-t border-white/5 pt-6">
              <p className="text-xs text-slate-600">
                Secure account verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}