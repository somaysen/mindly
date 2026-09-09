"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "onboardingData";

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");

  const handleContinue = () => {
    if (!name.trim()) {
      return;
    }

    // Get existing onboarding data
    const existingData =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    // Save Step 1 data
    const updatedData = {
      ...existingData,
      name: name.trim(),
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedData)
    );

    // Go to Step 2
    router.push("./intention");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-7xl h-[640px] items-center rounded-2xl overflow-hidden">

        {/* Left Image */}
        <div className="w-5xl h-screen flex items-center justify-center flex-col">
          <img
            className="w-[500px]"
            src="/images/Saying Hello.png"
            alt="image"
          />
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-[#181A46] h-full rounded-2xl flex flex-col p-10 text-white">

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-sm text-slate-400">
              Step 1 of 6
            </span>

            <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-1/6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">

            <AnimatePresence mode="wait">
              {name ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                    Welcome to Mindly, {name}!
                  </h1>

                  <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                    We're excited to have you here. Let's get started.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                    What should we call you?
                  </h1>

                  <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                    Tell us what you'd like Mindly to call you.
                    You can change this anytime in Settings.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="mb-10"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </motion.div>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}