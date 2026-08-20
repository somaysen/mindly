"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, Sun } from "lucide-react";

const planningOptions = [
  {
    id: "daily",
    title: "Daily",
    description: "Structured days",
    icon: Sun,
  },
  {
    id: "flexible",
    title: "Flexible",
    description: "Go with the flow",
    icon: Sparkles,
  },
  {
    id: "simple",
    title: "Simple",
    description: "Keep it simple",
    icon: CheckCircle,
  },
];

export default function PlanningPage() {
  const [selectedPlanning, setSelectedPlanning] = useState("");

  return (
    <main className="min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
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
              src="/images/timeline 1.png"
              alt="Planning"
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
              <span className="text-sm text-slate-300">
                Step 3 of 6
              </span>

              <div className="w-32 h-2 bg-[#d5d7ff] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "50%",
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
                <h1 className="text-[25px] leading-[1.2] font-semibold tracking-tight">
                  How do you like to plan?
                </h1>

                <p className="text-[14px] leading-[1.35] text-slate-300 mt-2 max-w-[400px]">
                  Choose the approach that feels most natural.
                  You can change it anytime.
                </p>
              </motion.div>

              {/* Planning Cards */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {planningOptions.map((option, index) => {
                  const Icon = option.icon;

                  const isSelected =
                    selectedPlanning === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlanning(option.id)
                      }
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
                        delay: 0.25 + index * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className={`
                        h-[153px]
                        rounded-[17px]
                        border
                        px-3
                        py-4
                        flex
                        flex-col
                        items-start
                        justify-start
                        text-left
                        transition-all
                        duration-200
                        ${
                          isSelected
                            ? "bg-[#575CF2] border-[#777CFF]"
                            : "bg-[#454674] border-[#60618A] hover:bg-[#4d4f7d]"
                        }
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`
                          mb-4
                          ${
                            isSelected
                              ? "text-white"
                              : "text-white"
                          }
                        `}
                      >
                        <Icon
                          size={23}
                          strokeWidth={1.8}
                        />
                      </div>

                      {/* Title */}
                      <h2 className="text-[17px] font-medium leading-5">
                        {option.title}
                      </h2>

                      {/* Description */}
                      <p className="text-[13px] text-slate-200 leading-[1.3] mt-1">
                        {option.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Continue Button */}
            <motion.button
              type="button"
              disabled={!selectedPlanning}
              whileHover={
                selectedPlanning
                  ? {
                      scale: 1.01,
                    }
                  : {}
              }
              whileTap={
                selectedPlanning
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
                  selectedPlanning
                    ? "bg-[#575CF2] hover:bg-[#6569F5]"
                    : "bg-[#575CF2] opacity-60 cursor-not-allowed"
                }
              `}
            >
              Continue
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}