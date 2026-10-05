"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, RotateCcw } from "lucide-react";

import MindlyBackground from "@/components/MindlyBackground";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08071a] px-5 py-16 text-white selection:bg-[#5264e8] selection:text-white">
      {/* Mindly Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
      >
        <MindlyBackground />
      </div>

      {/* Deep ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#5264e8]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#7776f5]/8 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#d3b5ff]/5 blur-[150px]" />

      {/* Main Card */}
      <section className="relative z-10 w-full max-w-xl rounded-[2.5rem] border border-white/[0.08] bg-[#0f0e24]/85 px-8 py-12 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:px-12 sm:py-14">
        
        {/* Mascot */}
        <div className="relative mx-auto mb-7 inline-block">
          <div className="absolute inset-0 rounded-full bg-[#5264e8]/15 blur-2xl" />
          <Image
            src="/images/Frame 407.png"
            alt="A little character looking confused"
            width={208}
            height={256}
            priority
            className="relative mx-auto h-36 w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Status Label */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#aeb2ff]">
          A little pause
        </p>

        {/* Title */}
        <h1 className="bg-gradient-to-r from-[#c4c7ff] via-[#d3b5ff] to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#9b9ab8] sm:text-base">
          We couldn’t load this page. Please try again in a moment, or return to your Mindly home.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#5264e8] to-[#7776f5] px-7 text-sm font-semibold text-white shadow-lg shadow-[#5264e8]/25 transition-all duration-300 hover:brightness-110 hover:shadow-[#5264e8]/40 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aeb2ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0e24] sm:w-auto"
          >
            <RotateCcw aria-hidden="true" size={17} />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aeb2ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0e24] sm:w-auto"
          >
            <Home aria-hidden="true" size={17} />
            Go to home
          </Link>
        </div>
      </section>
    </main>
  );
}