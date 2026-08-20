"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    image: "/images/LOGIN PNG.png",
    title: "Everything in one place.",
    description:
      "Capture tasks, reminders, ideas, and notes without worrying about where they belong.",
  },
  {
    image: "/images/Brainstorm 2 1.png",
    title: "Let AI do the sorting.",
    description:
      "Mindly automatically turns messy thoughts into tasks, reminders, events, and actionable plans.",
  },
  {
    image: "/images/office work 1.png",
    title: "Focus without the overwhelm.",
    description:
      "See what's important today and keep distractions out of the way.",
  },
  {
    image: "/images/Creative process 1.png",
    title: "Turn ideas into action.",
    description:
      "Capture inspiration, build plans, and follow through without switching between apps.",
  },
];

function LoginAnimation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = slides[currentSlide];

  return (
    <section
      className="
        flex min-h-full flex-col items-center justify-center
        overflow-hidden px-4 py-8 text-center
        lg:px-6
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slider */}
      <div className="relative flex w-full max-w-[500px] flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="flex w-full flex-col items-center"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Image */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.88,
                  y: 25,
                  filter: "blur(8px)",
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 0.94,
                  y: -20,
                  filter: "blur(6px)",
                  transition: {
                    duration: 0.35,
                    ease: "easeInOut",
                  },
                },
              }}
              className="
                relative flex h-[260px] w-full
                items-center justify-center
                md:h-[340px]
                lg:h-[400px]
              "
            >
              {/* Soft glow */}
              <div
                className="
                  absolute h-[180px] w-[180px]
                  rounded-full
                  bg-white/10
                  blur-[70px]
                  md:h-[240px] md:w-[240px]
                "
              />

              <Image
                src={slide.image}
                alt={slide.title}
                width={420}
                height={420}
                priority
                className="
                  relative z-10
                  h-auto w-[220px]
                  object-contain
                  drop-shadow-[0_30px_60px_rgba(38,31,128,0.28)]
                  md:w-[320px]
                  lg:w-[400px]
                "
              />
            </motion.div>

            {/* Text */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.15,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: {
                  opacity: 0,
                  y: -12,
                  transition: {
                    duration: 0.25,
                  },
                },
              }}
              className="mt-2 max-w-[440px]"
            >
              <h1
                className="
                  text-[0.5rem]
                  font-semibold
                  leading-[1.1]
                  tracking-[-0.045em]
                  text-white
                  md:text-[2.1rem]
                  lg:text-[2.4rem]
                "
              >
                {slide.title}
              </h1>

              <p
                className="
                  mx-auto mt-4
                  max-w-[400px]
                  text-[0.95rem]
                  leading-[1.5]
                  text-white/85
                  md:text-[1.05rem]
                  lg:text-[1.1rem]
                "
              >
                {slide.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Controls */}
      <div className="mt-8 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="
              relative flex h-3
              items-center justify-center
              outline-none
            "
          >
            <motion.span
              animate={{
                width: index === currentSlide ? 28 : 6,
                opacity: index === currentSlide ? 1 : 0.45,
              }}
              transition={{
                duration: 0.35,
                ease: "easeInOut",
              }}
              className="
                block h-1.5
                rounded-full
                bg-white
              "
            />
          </button>
        ))}
      </div>

      {/* Progress bar
      <div className="mt-5 h-[2px] w-[100px] overflow-hidden rounded-full bg-white/15">
        <motion.div
          key={currentSlide}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "0%" : "100%" }}
          transition={{
            duration: isPaused ? 0 : 4.5,
            ease: "linear",
          }}
          className="h-full rounded-full bg-white/70"
        />
      </div> */}
    </section>
  );
}

export default LoginAnimation;