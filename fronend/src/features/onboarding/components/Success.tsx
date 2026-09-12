"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { useUserInfo } from "@/features/onboarding/hooks/userOnbordingApi";

const STORAGE_KEY = "onboardingData";

type OnboardingData = {
  auth?: string;
  name?: string;
  interests?: string[];
  planning?: string[];
  taskId?: string;
  notificationId?: string;
};

export default function SuccessPage() {
  const {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
  } = useUserInfo();

  const submitted = useRef(false);

  // Exact payload passed to mutate()
  const [apiPayload, setApiPayload] =
    useState<OnboardingData | null>(null);

  useEffect(() => {
    if (submitted.current) {
      return;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      console.error("Onboarding data not found");
      return;
    }

    try {
      const data: OnboardingData = JSON.parse(savedData);

      // Exact data sent to the hook
      setApiPayload(data);

      console.log("DATA SENT TO API:", data);

      submitted.current = true;

      mutate(data, {
        onSuccess: (response) => {
          console.log("API RESPONSE:", response);

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
        <div className="flex w-full max-w-7xl min-h-[640px] items-center justify-center">

          {/* LEFT IMAGE */}
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
            className="w-full max-w-[500px] min-h-[600px] bg-[#181A46] rounded-[22px] flex flex-col p-8 sm:p-10 text-white"
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

            {/* STEP */}
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
            <div className="flex-1">

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
              >
                <h1 className="text-[25px] font-semibold tracking-tight mb-3">
                  Congratulations!
                </h1>

                <p className="text-slate-400 text-[15px] leading-relaxed">
                  {isPending
                    ? "Saving your information..."
                    : isError
                      ? "Something went wrong while saving your information."
                      : "You're all set up and ready to go."}
                </p>
              </motion.div>

              {/* ERROR */}
              {isError && (
                <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                  <p className="text-sm text-red-300">
                    {error instanceof Error
                      ? error.message
                      : "Failed to save your information."}
                  </p>
                </div>
              )}

              {/* ACTUAL API PAYLOAD AS FORM */}
              {apiPayload && (
                <motion.div
                  className="mt-8"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2
                      size={18}
                      className="text-[#7C82FF]"
                    />

                    <h2 className="text-sm font-medium">
                      Your Information
                    </h2>
                  </div>

                  <div className="space-y-3">

                    {/* NAME */}
                    {apiPayload.name && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                          Name
                        </label>

                        <div className="w-full rounded-xl bg-[#3F416C]/60 border border-[#5D6090]/40 px-4 py-3 text-sm text-white">
                          {apiPayload.name}
                        </div>
                      </div>
                    )}

                    {/* INTERESTS */}
                    {apiPayload.interests && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                          Interests
                        </label>

                        <div className="w-full rounded-xl bg-[#3F416C]/60 border border-[#5D6090]/40 px-4 py-3">
                          {apiPayload.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {apiPayload.interests.map(
                                (interest, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-[#575CF2]/20 text-xs text-[#C5C8FF]"
                                  >
                                    {interest}
                                  </span>
                                ),
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">
                              None
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PLANNING */}
                    {apiPayload.planning && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                          Planning
                        </label>

                        <div className="w-full rounded-xl bg-[#3F416C]/60 border border-[#5D6090]/40 px-4 py-3">
                          {apiPayload.planning.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {apiPayload.planning.map(
                                (plan, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-[#575CF2]/20 text-xs text-[#C5C8FF]"
                                  >
                                    {plan}
                                  </span>
                                ),
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">
                              None
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TASK ID */}
                    {apiPayload.taskId && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                          Task ID
                        </label>

                        <div className="w-full rounded-xl bg-[#3F416C]/60 border border-[#5D6090]/40 px-4 py-3 text-xs font-mono text-[#C5C8FF] break-all">
                          {apiPayload.taskId}
                        </div>
                      </div>
                    )}

                    {/* NOTIFICATION ID */}
                    {apiPayload.notificationId && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                          Notification ID
                        </label>

                        <div className="w-full rounded-xl bg-[#3F416C]/60 border border-[#5D6090]/40 px-4 py-3 text-xs font-mono text-[#C5C8FF] break-all">
                          {apiPayload.notificationId}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6 pt-6">
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
