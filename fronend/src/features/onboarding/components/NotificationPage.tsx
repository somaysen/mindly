"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  Target,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
// FIX 1: Fixed the typo in the import path
import { useNotificationCrate } from "@/features/onboarding/hooks/userOnbordingApi";

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
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);

  const {
    mutate: createNotification,
    isPending,
  } = useNotificationCrate();

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const handleContinue = () => {
    const notificationData = {
      app: "mindly", 
      notificationsEnabled: selected.length > 0,
      taskReminders: selected.includes("task-reminders"),
      focusSessions: selected.includes("focus-sessions"),
      weeklyReflections: selected.includes("weekly-reflections"),
    };

    // FIX 2: Added `as any` to bypass the strict FormData type check.
    // You can replace `any` with `FormData` if you import the type from your API file.
    createNotification(notificationData as any, {
      onSuccess: (response: any) => {
        console.log("Notification response:", response);

        const notificationId =
          response?.data?.notificationId ||
          response?.data?.settings?._id ||
          response?.notificationId ||
          response?._id ||
          response?.id ||
          response?.data?._id ||
          response?.data?.id;

        if (!notificationId) {
          console.error(
            "Notification created but ID was not returned:",
            response,
          );
          return;
        }

        // Save notification ID separately
        localStorage.setItem(
          "notificationId",
          notificationId,
        );

        // Get previous onboarding data
        let existingData = {};

        try {
          existingData = JSON.parse(
            localStorage.getItem("onboardingData") || "{}",
          );
        } catch (error) {
          console.error(
            "Failed to parse onboardingData:",
            error,
          );
        }

        // Add notification ID to onboarding data
        const updatedOnboardingData = {
          ...existingData,
          notificationId,
        };

        localStorage.setItem(
          "onboardingData",
          JSON.stringify(updatedOnboardingData),
        );

        console.log(
          "Notification ID saved:",
          notificationId,
        );

        // Go to success page
        router.push("./success");
      },

      // onError: (error) => {
      //   console.error(
      //     "Failed to create notification settings:",
      //     error,
      //   );
      // },
    });
  };

  const handleSkip = () => {
    router.push("./success");
  };

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-7xl h-160 items-center gap-5 justify-center overflow-hidden">

          {/* LEFT PANEL */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-center">
            <motion.img
              src="/images/reminder%201.png"
              alt="Reminder illustration"
              className="w-125 max-w-full object-contain"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          </div>

          {/* RIGHT PANEL */}
          <motion.div
            className="w-full max-w-125 h-150 bg-[#181A46] rounded-[22px] flex flex-col p-8 sm:p-10 text-white"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            {/* STEP INDICATOR */}
            <div className="flex items-center justify-between mb-9">
              <span className="text-sm text-slate-300">
                Step 5 of 6
              </span>

              <div
                className="w-32 h-2 bg-[#d5d7ff]/30 rounded-full overflow-hidden"
                aria-label="Step 5 of 6"
              >
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "83.33%" }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.1,
                }}
              >
                <h1 className="text-[25px] font-semibold tracking-tight mb-3">
                  Stay in the loop
                </h1>

                <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm">
                  Choose the reminders you'd like to receive.
                  You can change these anytime.
                </p>
              </motion.div>

              {/* OPTIONS */}
              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                }}
              >
                {REMINDER_OPTIONS.map(
                  ({
                    id,
                    icon: Icon,
                    title,
                    description,
                  }) => {
                    const isSelected =
                      selected.includes(id);

                    return (
                      <motion.button
                        key={id}
                        type="button"
                        onClick={() => toggle(id)}
                        whileTap={{ scale: 0.985 }}
                        aria-pressed={isSelected}
                        className={`
                          w-full flex items-center gap-4 rounded-2xl px-5 py-4
                          text-left transition-all duration-200 border
                          focus:outline-none focus-visible:ring-2
                          focus-visible:ring-[#575CF2]/60
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
                            w-10 h-10 rounded-xl flex items-center justify-center
                            shrink-0 transition-colors
                            ${
                              isSelected
                                ? "bg-white/15"
                                : "bg-[#2A2C55]"
                            }
                          `}
                        >
                          <Icon
                            size={18}
                            className={
                              isSelected
                                ? "text-white"
                                : "text-[#AEB2FF]"
                            }
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-medium text-white">
                            {title}
                          </p>

                          <p
                            className={`text-sm mt-0.5 ${
                              isSelected
                                ? "text-indigo-100"
                                : "text-slate-400"
                            }`}
                          >
                            {description}
                          </p>
                        </div>

                        {/* Check */}
                        <div className="w-6 h-6 flex items-center justify-center">
                          {isSelected && (
                            <motion.div
                              initial={{
                                scale: 0.5,
                                opacity: 0,
                              }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              }}
                              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                            >
                              <Check
                                size={14}
                                className="text-white"
                                strokeWidth={2.5}
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  },
                )}
              </motion.div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center gap-6 mt-auto pt-6">

              {/* SKIP */}
              <button
                type="button"
                onClick={handleSkip}
                disabled={isPending}
                className="text-[15px] text-slate-300 hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Skip for now
              </button>

              {/* CONTINUE */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={isPending}
                className="
                  flex-1 py-3.5 rounded-full font-medium
                  bg-[#575CF2] hover:bg-[#6569F5]
                  text-white flex items-center justify-center gap-2
                  transition-all duration-200 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isPending ? "Saving..." : "Continue"}

                {!isPending && (
                  <ArrowRight size={20} />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}