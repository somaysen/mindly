"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Flag,
  Plus,
} from "lucide-react";

import { useTaskCreate } from "@/features/tasks/hooks/useTesk";

export default function NotesPage() {
  const [task, setTask] = useState("");
  const [notes, setNotes] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<"high" | "">("");

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Task creation hook
  const { mutate: createTask, isPending } = useTaskCreate();

  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  const openTimePicker = () => {
    timeInputRef.current?.showPicker();
  };

  const formattedDate = dueDate
    ? new Date(dueDate + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Due date";

  const formattedTime = dueTime
    ? new Date(`1970-01-01T${dueTime}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Due time";

  const isValid = task.trim().length > 0;

  // ==========================================
  // CREATE TASK
  // ==========================================
  const handleContinue = () => {
    if (!isValid || isPending) return;

    const formData = new FormData();

    formData.append("TaskName", task.trim());
    formData.append("description", notes.trim());

    if (dueDate) {
      formData.append("dueDate", dueDate);
    }

    if (dueTime) {
      formData.append("dueTime", dueTime);
    }

    formData.append("priority", priority === "high" ? "high" : "medium");

    formData.append("status", "todo");

    createTask(formData, {
      onSuccess: (response) => {
        console.log("Task created:", response);

        // Your backend returns the task directly in response.data
        const taskId = response?.data?._id;

        if (!taskId) {
          console.error("Task ID not found in response");
          return;
        }
        console.log("Task is complied");

        // Save task ID separately
        localStorage.setItem("taskId", taskId);

        // Get previous onboarding data
        const existingData = JSON.parse(
          localStorage.getItem("onboardingData") || "{}",
        );

        // Add task ID to onboarding data
        localStorage.setItem(
          "onboardingData",
          JSON.stringify({
            ...existingData,
            taskId: taskId,
          }),
        );



        console.log("Task ID saved:", taskId);

        // Move to notification page
        window.location.href = "/onboarding/notification";
      },

      onError: (error) => {
        console.error("Task creation failed:", error);
      },
    });
  };

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-7xl h-[640px] items-center gap-5 rounded-2xl overflow-hidden justify-center">
          {/* LEFT SIDE */}
          <div className="hidden md:flex w-1/2 h-full items-center justify-center">
            <motion.img
              src="/images/Notes%202%201.png"
              alt="Add your first task"
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
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-slate-300">Step 4 of 6</span>

              <div className="w-32 h-2 bg-[#d5d7ff]/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#575CF2] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "66.66%" }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">
              {/* HEADING */}
              <motion.h1
                className="text-[25px] font-semibold tracking-tight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
              >
                Add your first task
              </motion.h1>

              {/* TASK INPUT */}
              <motion.div
                className="mt-7"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15,
                }}
              >
                <label htmlFor="task" className="sr-only">
                  Task title
                </label>

                <input
                  id="task"
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g. Finish portfolio case study"
                  className="w-full h-[68px] bg-[#454674] border border-[#60618A] rounded-[17px] px-4 text-[14px] text-white placeholder:text-slate-300 placeholder:italic outline-none focus:border-[#777CFF] focus:ring-2 focus:ring-[#575CF2]/30 transition-all"
                />
              </motion.div>

              {/* OPTIONAL DETAILS */}
              <motion.div
                className="mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                  aria-expanded={showDetails}
                >
                  <motion.span
                    animate={{
                      rotate: showDetails ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                  Optional details
                </button>

                <AnimatePresence initial={false}>
                  {showDetails && (
                    <motion.div
                      key="details"
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-3 pt-4">
                        {/* DATE */}
                        <div className="relative flex-1">
                          <button
                            type="button"
                            onClick={openDatePicker}
                            className="w-full h-[38px] rounded-xl bg-[#3F416C] border border-[#5D6090] flex items-center justify-center gap-2 text-[12px] text-slate-200 hover:bg-[#4A4D7A] hover:border-[#7276B5] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.12)]"
                          >
                            <CalendarDays
                              size={16}
                              className="text-[#AEB2FF]"
                            />

                            <span>{formattedDate}</span>
                          </button>

                          <input
                            ref={dateInputRef}
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                            tabIndex={-1}
                          />
                        </div>

                        {/* TIME */}
                        <div className="relative flex-1">
                          <button
                            type="button"
                            onClick={openTimePicker}
                            className="w-full h-[38px] rounded-xl bg-[#3F416C] border border-[#5D6090] flex items-center justify-center gap-2 text-[12px] text-slate-200 hover:bg-[#4A4D7A] hover:border-[#7276B5] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.12)]"
                          >
                            <Clock3 size={16} className="text-[#AEB2FF]" />

                            <span>{formattedTime}</span>
                          </button>

                          <input
                            ref={timeInputRef}
                            type="time"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                            tabIndex={-1}
                          />
                        </div>

                        {/* PRIORITY */}
                        <button
                          type="button"
                          onClick={() =>
                            setPriority((p) => (p === "high" ? "" : "high"))
                          }
                          className={`
                            flex-1 h-[38px] rounded-xl border flex items-center justify-center gap-2 text-[12px]
                            transition-all duration-200
                            shadow-[0_4px_15px_rgba(0,0,0,0.12)]
                            ${
                              priority === "high"
                                ? "bg-[#575CF2] border-[#777CFF] text-white"
                                : "bg-[#3F416C] border-[#5D6090] text-slate-200 hover:bg-[#4A4D7A] hover:border-[#7276B5]"
                            }
                          `}
                          aria-pressed={priority === "high"}
                        >
                          <Flag size={16} />

                          {priority === "high" ? "High priority" : "Priority"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* DATE / TIME SUMMARY */}
              <AnimatePresence>
                {(dueDate || dueTime) && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 6,
                    }}
                    className="flex items-center gap-4 mt-3 text-xs text-slate-400"
                  >
                    {dueDate && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-[#AEB2FF]" />

                        {formattedDate}
                      </span>
                    )}

                    {dueTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} className="text-[#AEB2FF]" />

                        {formattedTime}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NOTES */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => setShowNotes((v) => !v)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                  aria-expanded={showNotes}
                >
                  <Plus
                    size={17}
                    className={`transition-transform duration-200 ${
                      showNotes ? "rotate-45" : ""
                    }`}
                  />
                  Notes
                </button>

                <AnimatePresence initial={false}>
                  {showNotes && (
                    <motion.div
                      key="notes"
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add a note..."
                        rows={3}
                        className="mt-3 w-full resize-none rounded-xl bg-[#454674] border border-[#60618A] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-[#777CFF] focus:ring-2 focus:ring-[#575CF2]/30 transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="flex items-center gap-5 mt-auto pt-6">
              {/* SKIP */}
              <Link
                href="./notification"
                className="text-[15px] text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Skip for now
              </Link>

              {/* CONTINUE */}
              <motion.button
                type="button"
                disabled={!isValid || isPending}
                onClick={handleContinue}
                whileHover={isValid && !isPending ? { scale: 1.01 } : undefined}
                whileTap={isValid && !isPending ? { scale: 0.98 } : undefined}
                className={`
                  flex-1 py-3.5 rounded-full font-medium flex items-center justify-center gap-2
                  transition-all duration-200
                  ${
                    isValid && !isPending
                      ? "bg-[#575CF2] hover:bg-[#6569F5] text-white"
                      : "bg-[#575CF2]/60 cursor-not-allowed text-white/70"
                  }
                `}
              >
                {isPending ? "Creating..." : "Continue"}

                {!isPending && <ArrowRight size={20} />}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
