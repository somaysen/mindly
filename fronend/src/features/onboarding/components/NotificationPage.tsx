"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Target, Sparkles, ArrowRight, Check } from "lucide-react";

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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-7xl h-[640px] items-center gap-5 justify-center overflow-hidden">
          {/* LEFT PANEL */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-center">
            <motion.img
              src="/images/reminder%201.png"
              alt="Reminder illustration"
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
              <span className="text-sm text-slate-300">Step 5 of 6</span>

              <div
                className="w-32 h-2 bg-[#d5d7ff]/30 rounded-full overflow-hidden"
                aria-label="Step 5 of 6"
              >
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "83.33%" }}
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
                  Stay in the loop
                </h1>
                <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm">
                  Choose the reminders you&apos;d like to receive. You can change
                  these anytime.
                </p>
              </motion.div>

              {/* OPTIONS */}
              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {REMINDER_OPTIONS.map(({ id, icon: Icon, title, description }) => {
                  const isSelected = selected.includes(id);

                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => toggle(id)}
                      whileTap={{ scale: 0.985 }}
                      aria-pressed={isSelected}
                      className={`
                        w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left
                        transition-all duration-200 border
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#575CF2]/60
                        ${
                          isSelected
                            ? "bg-[#575CF2] border-[#777CFF] shadow-[0_0_0_1px_rgba(87,92,242,0.4)]"
                            : "bg-[#3F416C]/60 border-[#5D6090]/50 hover:bg-[#4A4D7A] hover:border-[#7276B5]"
                        }
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`
                          w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                          transition-colors
                          ${isSelected ? "bg-white/15" : "bg-[#2A2C55]"}
                        `}
                      >
                        <Icon
                          size={18}
                          className={isSelected ? "text-white" : "text-[#AEB2FF]"}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-medium text-white">
                          {title}
                        </p>
                        <p
                          className={`text-sm mt-0.5 ${
                            isSelected ? "text-indigo-100" : "text-slate-400"
                          }`}
                        >
                          {description}
                        </p>
                      </div>

                      {/* Check indicator */}
                      <div className="w-6 h-6 flex items-center justify-center">
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                          >
                            <Check size={14} className="text-white" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center gap-6 mt-auto pt-6">
              <Link
                href="./success"
                className="text-[15px] text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Skip for now
              </Link>

              <Link
                href="./success"
                className="flex-1 py-3.5 rounded-full font-medium bg-[#575CF2] hover:bg-[#6569F5] text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              >
                Continue
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}