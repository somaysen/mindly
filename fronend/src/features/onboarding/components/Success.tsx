"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useUserInfo } from "@/features/onboarding/hooks/userOnbordingApi";

const STORAGE_KEY = "onboardingData";

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
  const {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
  } = useUserInfo();

  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) {
      return;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    console.log(savedData);

    if (!savedData) {
      console.error("Onboarding data not found");
      return;
    }

    try {
      const data = JSON.parse(savedData);

      submitted.current = true;

      mutate(data, {
        onSuccess: () => {
          // Remove onboarding data only after
          // the API request succeeds.
          localStorage.removeItem(STORAGE_KEY);
        },

        onError: (err) => {
          console.error("Create user failed:", err);
          submitted.current = false;
        },
      });
    } catch (err) {
      console.error("Invalid onboarding data:", err);
      submitted.current = false;
    }
  }, [mutate]);

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-7xl h-[640px] items-center gap-5 justify-center overflow-hidden">

          {/* LEFT PANEL */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-center">
            <motion.img
              src="/images/organized%201.png"
              alt="You're all set illustration"
              className="w-[500px] max-w-full object-contain"
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          </div>

          {/* RIGHT PANEL */}
          <motion.div
            className="w-full max-w-[500px] h-[600px] bg-[#181A46] rounded-[22px] flex flex-col p-8 sm:p-10 text-white"
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            {/* STEP INDICATOR */}
            <div className="flex items-center justify-between mb-9">
              <span className="text-sm text-slate-300">
                Step 6 of 6
              </span>

              <div className="w-32 h-2 bg-[#d5d7ff]/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">

              {/* HEADER */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.1,
                }}
              >
                <h1 className="text-[25px] font-semibold tracking-tight mb-3">
                  Congratulations!
                </h1>

                <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm">
                  {isPending
                    ? "Saving your information..."
                    : isError
                      ? "Something went wrong while saving your information."
                      : "You're all set up and ready to go. Here's what we've prepared for you"}
                </p>
              </motion.div>

              {/* ERROR */}
              {isError && (
                <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                  <p className="text-sm text-red-300">
                    {error?.message ||
                      "Failed to save your information."}
                  </p>
                </div>
              )}

              {/* SUMMARY */}
              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                }}
              >
                {SUMMARY_ITEMS.map(
                  (
                    {
                      id,
                      icon: Icon,
                      title,
                      description,
                    },
                    index,
                  ) => (
                    <motion.div
                      key={id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: 0.25 + index * 0.08,
                      }}
                      className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 bg-[#3F416C]/60 border border-[#5D6090]/40"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#2A2C55] flex items-center justify-center shrink-0">
                        <Icon
                          size={18}
                          className="text-[#AEB2FF]"
                        />
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
              {isSuccess ? (
                <Link
                  href="/"
                  className="w-full py-3.5 rounded-full font-medium bg-[#575CF2] hover:bg-[#6569F5] text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-full font-medium bg-[#575CF2]/50 text-white flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  {isPending
                    ? "Saving..."
                    : isError
                      ? "Unable to save"
                      : "Saving your information..."}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}