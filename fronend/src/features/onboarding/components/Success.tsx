"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Target, Sparkles, ArrowRight } from "lucide-react";

const SUMMARY_ITEMS = [
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

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-7xl h-[640px] items-center rounded-2xl overflow-hidden">
        {/* Left Panel - Illustration */}
        <div className="w-1/2 h-screen flex items-center justify-center flex-col">
          <img
            className="w-[500px]"
            src="\images\organized 1.png"
            alt="image"
          />
        </div>

        {/* Right Panel - Summary */}
        <div className="w-1/2 bg-[#181A46] h-full rounded-2xl flex flex-col p-10 text-white">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-sm text-slate-400">Step 6 of 6</span>

            <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                You&apos;re all set!
              </h1>

              <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                Here&apos;s what we&apos;ve prepared
              </p>
            </motion.div>

            {/* Summary list */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              {SUMMARY_ITEMS.map(({ id, icon: Icon, title, description }) => (
                <div
                  key={id}
                  className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 bg-slate-700/40"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-slate-200" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium">{title}</p>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Go to Dashboard */}
          <Link
            href="/dashboard"
            className="w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}