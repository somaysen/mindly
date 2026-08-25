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
    <main className="min-h-screen overflow-hidden text-white">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-7xl h-[640px] items-center gap-5 justify-center overflow-hidden">
          {/* LEFT PANEL - Illustration */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-center">
            <motion.img
              src="/images/organized%201.png"
              alt="You're all set illustration"
              className="w-[500px] max-w-full object-contain"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* RIGHT PANEL */}
          <motion.div
            className="w-full max-w-[500px] h-[600px] bg-[#181A46] rounded-[22px] flex flex-col p-8 sm:p-10 text-white"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* STEP INDICATOR */}
            <div className="flex items-center justify-between mb-9">
              <span className="text-sm text-slate-300">Step 6 of 6</span>

              <div className="w-32 h-2 bg-[#d5d7ff]/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <h1 className="text-[25px] font-semibold tracking-tight mb-3">
                  Congratulations!
                </h1>
                <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm">
                  You&apos;re all set up and ready to go. Here&apos;s what
                  we&apos;ve prepared for you
                </p>
              </motion.div>

              {/* SUMMARY LIST */}
              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {SUMMARY_ITEMS.map(
                  ({ id, icon: Icon, title, description }, index) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.25 + index * 0.08,
                      }}
                      className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 bg-[#3F416C]/60 border border-[#5D6090]/40"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#2A2C55] flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-[#AEB2FF]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-white">
                          {title}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                  ),
                )}
              </motion.div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6">
              <Link
                href="/"
                className="w-full py-3.5 rounded-full font-medium bg-[#575CF2] hover:bg-[#6569F5] text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}