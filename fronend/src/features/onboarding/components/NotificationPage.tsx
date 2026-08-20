"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Target, Sparkles, ArrowRight } from "lucide-react";

const REMINDER_OPTIONS = [
  {
    id: "task-reminders",
    icon: Bell,
    title: "Task Reminders",
    description: "Never miss a deadline",
  },
  {
    id: "focus-sessions",
    icon: Target,
    title: "Focus Sessions",
    description: "Stay in the zone",
  },
  {
    id: "weekly-reflections",
    icon: Sparkles,
    title: "Weekly Reflections",
    description: "Review your progress",
  },
];

export default function RemindersOnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl h-[640px] gap-4 items-center rounded-2xl overflow-hidden">
        {/* Left Panel - Illustration */}
        <div className="w-1/2 h-screen flex items-center justify-center flex-col">
          <img
            className="w-[500px]"
            src="\images\reminder 1.png"
            alt="image"
          />
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 bg-[#181A46] h-full rounded-2xl flex flex-col p-10 text-white">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-sm text-slate-400">Step 5 of 6</span>

            <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-5/6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                Stay in the loop
              </h1>

              <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                Choose the reminders you&apos;d like to receive. You can
                change these anytime.
              </p>
            </motion.div>

            {/* Options */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              {REMINDER_OPTIONS.map(({ id, icon: Icon, title, description }) => {
                const isSelected = selected.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors ${
                      isSelected
                        ? "bg-indigo-500/30 ring-1 ring-indigo-400/60"
                        : "bg-slate-700/40 hover:bg-slate-700/60"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-slate-200" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium">{title}</p>
                      <p className="text-sm text-slate-400">{description}</p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Link
              href="./final-step"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Skip for now
            </Link>

            <Link
              href="./final-step"
              className="bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-medium py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}