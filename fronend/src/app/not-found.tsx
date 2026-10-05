"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Home, ArrowLeft, Search, Sparkles, Compass } from "lucide-react";
import MindlyBackground from "@/components/MindlyBackground";

export default function NotFoundPage() {
  const [barked, setBarked] = useState(false);
  const [speechText, setSpeechText] = useState("Lost in space? Woof! Let me help!");

  const handleMascotClick = () => {
    setBarked(true);
    const phrases = [
      "Woof! You found a secret spot!",
      "Arf! This page chased its own tail!",
      "Don't worry, every good explorer gets lost!",
      "Let's fetch you back home, human!",
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setSpeechText(randomPhrase);
    setTimeout(() => setBarked(false), 3000);
  };

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
        
        {/* Speech Bubble */}
        {barked && (
          <div className="absolute -top-14 left-1/2 z-20 -translate-x-1/2 animate-bounce rounded-2xl bg-gradient-to-r from-[#5264e8] to-[#7776f5] px-4 py-2.5 text-xs font-medium text-white shadow-xl shadow-[#5264e8]/20 whitespace-nowrap">
            {speechText}
            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#7776f5]" />
          </div>
        )}

        {/* Mascot */}
        <div
          onClick={handleMascotClick}
          className="group relative inline-block cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          title="Click me!"
        >
          <div className="absolute inset-0 rounded-full bg-[#5264e8]/15 blur-2xl transition-all duration-500 group-hover:bg-[#7776f5]/25 group-hover:blur-3xl" />
          <Image
            src="/images/Frame 407.png"
            alt="A little character looking confused"
            width={208}
            height={256}
            priority
            className="relative mx-auto mb-7 h-36 w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:rotate-3"
          />
        </div>

        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-[#aeb2ff] backdrop-blur-md">
          <Sparkles
            size={13}
            className="text-[#d3b5ff] animate-spin"
            style={{ animationDuration: "7s" }}
          />
          Error 404 • Lost in Mindly
        </div>

        {/* Title */}
        <h1 className="bg-gradient-to-r from-[#c4c7ff] via-[#d3b5ff] to-white bg-clip-text text-5xl font-bold tracking-[-0.05em] text-transparent sm:text-6xl">
          Oops, Page Lost
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#9b9ab8] sm:text-base">
          This page wandered off into the digital cosmos or took a nap. Let’s get you back on track before our mascot gets too confused!
        </p>

        {/* Quick Links */}
        <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 text-left">
          <Link
            href="/explore"
            className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-all duration-300 hover:border-[#aeb2ff]/30 hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5264e8]/15 text-[#aeb2ff] transition-all duration-300 group-hover:bg-[#5264e8] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#5264e8]/25">
              <Compass size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Explore Hub</p>
              <p className="text-xs text-[#8a89a8]">Discover features</p>
            </div>
          </Link>

          <Link
            href="/support"
            className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-all duration-300 hover:border-[#aeb2ff]/30 hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7776f5]/15 text-[#d3b5ff] transition-all duration-300 group-hover:bg-[#7776f5] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#7776f5]/25">
              <Search size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Help Center</p>
              <p className="text-xs text-[#8a89a8]">Find answers</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#5264e8] to-[#7776f5] px-7 text-sm font-semibold text-white shadow-lg shadow-[#5264e8]/25 transition-all duration-300 hover:brightness-110 hover:shadow-[#5264e8]/40 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aeb2ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0e24] sm:w-auto"
          >
            <Home aria-hidden="true" size={17} />
            Go back home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] sm:w-auto"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Previous page
          </button>
        </div>
      </section>
    </main>
  );
}