"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Flag,
  Plus,
} from "lucide-react";

export default function NotesPage() {
  const [task, setTask] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("");

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Open calendar
  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  // Open clock
  const openTimePicker = () => {
    timeInputRef.current?.showPicker();
  };

  // Format date
  const formattedDate = dueDate
    ? new Date(dueDate + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Due date";

  // Format time
  const formattedTime = dueTime
    ? new Date(`1970-01-01T${dueTime}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Due time";

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Main Container */}
        <div
          className="
            flex
            w-full
            max-w-7xl
            h-[640px]
            items-center
            rounded-2xl
            overflow-hidden
          "
        >
          {/* ================================= */}
          {/* LEFT SIDE */}
          {/* ================================= */}

          <div className="w-1/2 h-full flex items-center justify-center">
            <motion.img
              src="/images/Notes 2 1.png"
              alt="Add your first task"
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

          {/* ================================= */}
          {/* RIGHT PANEL */}
          {/* ================================= */}

          <motion.div
            className="
              w-1/2
              h-[580px]
              bg-[#181A46]
              rounded-[22px]
              flex
              flex-col
              p-10
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
            {/* ================================= */}
            {/* STEP INDICATOR */}
            {/* ================================= */}

            <div className="flex items-center justify-between mb-9">
              <span className="text-sm text-slate-300">
                Step 4 of 6
              </span>

              <div className="w-32 h-2 bg-[#d5d7ff] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "66.66%",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            {/* ================================= */}
            {/* CONTENT */}
            {/* ================================= */}

            <div className="flex-1">
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
                  delay: 0.1,
                }}
              >
                <h1 className="text-[25px] font-semibold tracking-tight">
                  Add your first task
                </h1>
              </motion.div>

              {/* ================================= */}
              {/* TASK INPUT */}
              {/* ================================= */}

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
                  duration: 0.4,
                  delay: 0.2,
                }}
                className="mt-8"
              >
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g. Finish portfolio case study"
                  className="
                    w-full
                    h-[68px]
                    bg-[#454674]
                    border
                    border-[#60618A]
                    rounded-[17px]
                    px-4
                    text-[14px]
                    text-white
                    placeholder:text-slate-300
                    placeholder:italic
                    outline-none
                    focus:border-[#777CFF]
                    focus:ring-2
                    focus:ring-[#575CF2]/30
                    transition-all
                  "
                />
              </motion.div>

              {/* ================================= */}
              {/* OPTIONAL DETAILS */}
              {/* ================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="mt-6"
              >
                {/* Optional Details Button */}
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-300
                    hover:text-white
                    transition-colors
                  "
                >
                  <motion.span
                    animate={{
                      rotate: showDetails ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <ChevronDown size={16} />
                  </motion.span>

                  Optional details
                </button>

                {/* Details */}
                <motion.div
                  initial={false}
                  animate={{
                    height: showDetails ? "auto" : 0,
                    opacity: showDetails ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3 pt-4">
                    {/* ================================= */}
                    {/* DATE */}
                    {/* ================================= */}

                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={openDatePicker}
                        className="
                          w-full
                          h-[38px]
                          rounded-xl
                          bg-[#3F416C]
                          border
                          border-[#5D6090]
                          flex
                          items-center
                          justify-center
                          gap-2
                          text-[12px]
                          text-slate-200
                          hover:bg-[#4A4D7A]
                          hover:border-[#7276B5]
                          active:scale-[0.98]
                          transition-all
                          duration-200
                          shadow-[0_4px_15px_rgba(0,0,0,0.12)]
                        "
                      >
                        <CalendarDays
                          size={16}
                          className="text-[#AEB2FF]"
                        />

                        <span>{formattedDate}</span>
                      </button>

                      {/* Hidden native calendar */}
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={dueDate}
                        onChange={(e) =>
                          setDueDate(e.target.value)
                        }
                        className="
                          absolute
                          opacity-0
                          pointer-events-none
                          w-0
                          h-0
                        "
                      />
                    </div>

                    {/* ================================= */}
                    {/* TIME */}
                    {/* ================================= */}

                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={openTimePicker}
                        className="
                          w-full
                          h-[38px]
                          rounded-xl
                          bg-[#3F416C]
                          border
                          border-[#5D6090]
                          flex
                          items-center
                          justify-center
                          gap-2
                          text-[12px]
                          text-slate-200
                          hover:bg-[#4A4D7A]
                          hover:border-[#7276B5]
                          active:scale-[0.98]
                          transition-all
                          duration-200
                          shadow-[0_4px_15px_rgba(0,0,0,0.12)]
                        "
                      >
                        <Clock3
                          size={16}
                          className="text-[#AEB2FF]"
                        />

                        <span>{formattedTime}</span>
                      </button>

                      {/* Hidden native time picker */}
                      <input
                        ref={timeInputRef}
                        type="time"
                        value={dueTime}
                        onChange={(e) =>
                          setDueTime(e.target.value)
                        }
                        className="
                          absolute
                          opacity-0
                          pointer-events-none
                          w-0
                          h-0
                        "
                      />
                    </div>

                    {/* ================================= */}
                    {/* PRIORITY */}
                    {/* ================================= */}

                    <button
                      type="button"
                      onClick={() => {
                        setPriority(
                          priority === "high" ? "" : "high"
                        );
                      }}
                      className={`
                        flex-1
                        h-[38px]
                        rounded-xl
                        border
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-[12px]
                        transition-all
                        duration-200
                        shadow-[0_4px_15px_rgba(0,0,0,0.12)]
                        ${
                          priority === "high"
                            ? "bg-[#575CF2] border-[#777CFF] text-white"
                            : "bg-[#3F416C] border-[#5D6090] text-slate-200 hover:bg-[#4A4D7A] hover:border-[#7276B5]"
                        }
                      `}
                    >
                      <Flag size={16} />

                      {priority === "high"
                        ? "High priority"
                        : "Priority"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>

              {/* ================================= */}
              {/* SELECTED DATE / TIME */}
              {/* ================================= */}

              {(dueDate || dueTime) && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="
                    flex
                    items-center
                    gap-4
                    mt-4
                    text-xs
                    text-slate-400
                  "
                >
                  {dueDate && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays
                        size={14}
                        className="text-[#AEB2FF]"
                      />

                      {formattedDate}
                    </span>
                  )}

                  {dueTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock3
                        size={14}
                        className="text-[#AEB2FF]"
                      />

                      {formattedTime}
                    </span>
                  )}
                </motion.div>
              )}

              {/* ================================= */}
              {/* NOTES */}
              {/* ================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.4,
                }}
                className="mt-7"
              >
                {/* Notes Button */}
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-300
                    hover:text-white
                    transition-colors
                  "
                >
                  <Plus
                    size={17}
                    className={`
                      transition-transform
                      duration-200
                      ${showNotes ? "rotate-45" : ""}
                    `}
                  />

                  Notes
                </button>

                {/* Notes Input */}
                <motion.div
                  initial={false}
                  animate={{
                    height: showNotes ? "auto" : 0,
                    opacity: showNotes ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="overflow-hidden"
                >
                  <textarea
                    placeholder="Add a note..."
                    className="
                      mt-4
                      w-full
                      h-20
                      resize-none
                      rounded-xl
                      bg-[#454674]
                      border
                      border-[#60618A]
                      px-4
                      py-3
                      text-sm
                      text-white
                      placeholder:text-slate-400
                      outline-none
                      focus:border-[#777CFF]
                      focus:ring-2
                      focus:ring-[#575CF2]/30
                      transition-all
                    "
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* ================================= */}
            {/* BOTTOM ACTIONS */}
            {/* ================================= */}

            <div className="flex items-center gap-6 mt-auto">
              {/* Skip */}
              <Link
                href="./planning"
                className="
                  text-[15px]
                  text-slate-300
                  hover:text-white
                  transition-colors
                  whitespace-nowrap
                "
              >
                Skip for now
              </Link>

              {/* Continue */}
              <motion.button
                type="button"
                disabled={!task.trim()}
                whileHover={
                  task.trim()
                    ? {
                        scale: 1.01,
                      }
                    : {}
                }
                whileTap={
                  task.trim()
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }
                className={`
                  flex-1
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
                    task.trim()
                      ? "bg-[#575CF2] hover:bg-[#6569F5]"
                      : "bg-[#575CF2] opacity-60 cursor-not-allowed"
                  }
                `}
              >
                Continue

                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}