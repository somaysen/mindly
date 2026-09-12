"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Atom, BookOpen, Focus } from "lucide-react";

const intentions = [
  {
    id: "organized",
    title: "Stay organized",
    description: "Keep track of tasks and plans",
    icon: BookOpen,
  },
  {
    id: "overwhelm",
    title: "Reduce overwhelm",
    description: "Clear mental clutter and stay calm",
    icon: Atom,
  },
  {
    id: "focus",
    title: "Focus better",
    description: "Stay present and finish meaningful work",
    icon: Focus,
  },
];

export default function IntentionPage() {
  const [selectedIntention, setSelectedIntention] = useState("");

  const existingData = JSON.parse(localStorage.getItem("onboardingData")) || {};

  localStorage.setItem(
    "onboardingData",
    JSON.stringify({
      ...existingData,
      intention: [selectedIntention],
    }),
  );

  return (
    <main className="min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div
        className="
          relative
          min-h-screen
          flex
          items-center
          justify-center
          p-4
        "
      >
        {/* Main Container */}
        <div
          className="
            flex
            w-full
            max-w-[1400px]
            h-[640px]
            items-center
            justify-center
            rounded-2xl
            overflow-hidden
          "
        >
          {/* LEFT SIDE */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <motion.img
              src="/images/Questions 1.png"
              alt="Questions"
              className="w-[500px] object-contain"
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
            className="
              w-1/3
              h-[580px]
              bg-[#181A46]
              rounded-[22px]
              flex
              flex-col
              p-7
              md:p-8
              text-white
            "
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
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-9">
              <span className="text-sm text-slate-300">Step 2 of 6</span>

              <div className="w-32 h-2 bg-[#d5d7ff] rounded-full overflow-hidden">
                <motion.div
                  className="
                    h-full
                    bg-[#575cf2]
                    rounded-full
                  "
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "33.33%",
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
              {/* Heading */}
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
                  delay: 0.15,
                }}
              >
                <h1 className="text-[25px] leading-[1.2] font-semibold tracking-tight max-w-[440px]">
                  What do you want Mindly to help you with?
                </h1>
              </motion.div>

              {/* Intention Cards */}
              <div className="mt-8 space-y-4">
                {intentions.map((item, index) => {
                  const Icon = item.icon;

                  const isSelected = selectedIntention === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIntention(item.id)}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: 0.2 + index * 0.08,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        scale: 1.01,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      className={`
                        w-full
                        min-h-[68px]
                        rounded-[17px]
                        border
                        px-4
                        py-3
                        flex
                        items-center
                        text-left
                        transition-all
                        duration-200
                        ${
                          isSelected
                            ? "bg-[#575cf2] border-[#777cff]"
                            : "bg-[#454674] border-[#60618a] hover:bg-[#4d4f7d]"
                        }
                      `}
                    >
                      {/* Icon */}
                      <div
                        className="
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                          mr-4
                          shrink-0
                          text-white
                        "
                      >
                        <Icon size={23} strokeWidth={1.7} />
                      </div>

                      {/* Text */}
                      <div>
                        <h2 className="text-[16px] font-medium leading-5">
                          {item.title}
                        </h2>

                        <p className="text-[13px] text-slate-200 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Continue Button */}
            <Link
              href={selectedIntention ? "/onboarding/planning" : "#"}
              aria-disabled={!selectedIntention}
              className={`
                w-full
                ${!selectedIntention ? "pointer-events-none" : ""}
              `}
            >
              <motion.div
                whileHover={
                  selectedIntention
                    ? {
                        scale: 1.01,
                      }
                    : {}
                }
                whileTap={
                  selectedIntention
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }
                className={`
                  w-full
                  py-3.5
                  rounded-full
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                  duration-200
                  ${
                    selectedIntention
                      ? "bg-[#575cf2] hover:bg-[#6569f5]"
                      : "bg-[#575cf2] opacity-60 cursor-not-allowed"
                  }
                `}
              >
                Continue
                <ArrowRight size={20} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
