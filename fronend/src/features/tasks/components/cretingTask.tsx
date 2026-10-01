"use client";

import React, { useState } from "react";

import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";

import { useTaskCreate } from "@/features/tasks/hooks/useTesk";
import { toast } from "react-toastify";

// ===============================
// TYPES
// ===============================

interface NewTaskModalProps {
  onClose?: () => void;

  onAddTask?: (task: {
    taskName: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: string;
    checklist: string[];
  }) => void;
}

// ===============================
// COMPONENT
// ===============================

export default function NewTaskModal({
  onClose,
  onAddTask,
}: NewTaskModalProps) {
  // ===============================
  // FORM STATES
  // ===============================

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("");

  const [showOptional, setShowOptional] = useState(true);

  const [checklist, setChecklist] = useState<string[]>([
    // "Update wireframes",
    // "Finalize typography",
  ]);

  const [newChecklistItem, setNewChecklistItem] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // ===============================
  // CREATE TASK HOOK
  // ===============================

  const {
    mutateAsync: createTask,
    isPending,
  } = useTaskCreate();

  // ===============================
  // ADD CHECKLIST ITEM
  // ===============================

  const addChecklistItem = () => {
    const item = newChecklistItem.trim();

    if (!item) return;

    setChecklist((prev) => [...prev, item]);

    setNewChecklistItem("");
  };

  // ===============================
  // REMOVE CHECKLIST ITEM
  // ===============================

  const removeChecklistItem = (index: number) => {
    setChecklist((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ===============================
  // CREATE TASK
  // ===============================

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      const message = "Please enter a task name.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    try {
      setErrorMessage("");

      // ===============================
      // CREATE FORMDATA
      // ===============================

      const formData = new FormData();

      formData.append(
        "taskName",
        taskName.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      if (dueDate) {
        formData.append(
          "dueDate",
          dueDate
        );
      }

      if (dueTime) {
        formData.append(
          "dueTime",
          dueTime
        );
      }

      if (priority) {
        formData.append(
          "priority",
          priority
        );
      }

      // Send checklist as JSON string
      formData.append(
        "checklist",
        JSON.stringify(checklist)
      );

      // ===============================
      // DEBUG
      // ===============================

      console.log("📤 Creating task...");

      console.log({
        taskName: taskName.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        checklist,
      });

      // ===============================
      // API CALL
      // ===============================

      const response = await createTask(formData);
      toast.success("Task created successfully.");

      console.log(
        "✅ Task created successfully:",
        response
      );

      // ===============================
      // OPTIONAL PARENT CALLBACK
      // ===============================

      onAddTask?.({
        taskName: taskName.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        checklist,
      });

      // ===============================
      // RESET FORM
      // ===============================

      setTaskName("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setPriority("");

      setChecklist([]);

      setNewChecklistItem("");

      // ===============================
      // CLOSE MODAL
      // ===============================

      onClose?.();

    } catch (error: any) {
      console.error(
        "❌ Task creation failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create task";

      setErrorMessage(message);
      toast.error(message);
    }
  };

  // ===============================
  // ENTER KEY
  // ===============================

  const handleChecklistKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      addChecklistItem();
    }
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">

      {/* ================= BACKDROP ================= */}

      <div
        className="
          absolute
          inset-0
          bg-[#080719]/70
          backdrop-blur-[9px]
        "
        onClick={onClose}
      />

      {/* ================= MODAL ================= */}

      <div
        className="
          relative
          ml-auto
          mr-[3vw]
          flex
          h-[600px]
          w-[430px]
          flex-col
          overflow-hidden
          rounded-[20px]
          border
          border-white/[0.06]
          bg-[#24234f]
          shadow-[0_30px_100px_rgba(0,0,0,0.55)]
        "
      >

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between px-8 pt-8">

          <div className="flex items-center gap-2">

            <h2 className="text-[18px] font-semibold text-white">
              New Task
            </h2>

            <span
              className="
                flex
                h-[15px]
                w-[15px]
                items-center
                justify-center
                rounded-full
                bg-[#6366f1]
                text-[9px]
                font-bold
                text-white
              "
            >
              ✓
            </span>

          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="
              text-[#b5b5d2]
              transition
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X
              size={20}
              strokeWidth={1.7}
            />
          </button>

        </div>

        {/* ================= FORM ================= */}

        <div
          className="
            mt-7
            flex-1
            overflow-y-auto
            px-8
            pb-5
            scrollbar-none
          "
        >

          {/* ================= TASK NAME ================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-[11px]
                font-medium
                text-[#c7c6df]
              "
            >
              Task Name
            </label>

            <input
              type="text"
              value={taskName}
              onChange={(e) =>
                setTaskName(e.target.value)
              }
              placeholder="What needs to be done"
              disabled={isPending}
              className="
                h-[42px]
                w-full
                rounded-[9px]
                border
                border-[#393861]
                bg-[#19183a]
                px-3
                text-[12px]
                text-white
                outline-none
                placeholder:text-[#72718d]
                focus:border-[#6668ed]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

          </div>

          {/* ================= DESCRIPTION ================= */}

          <div className="mt-5">

            <label
              className="
                mb-2
                block
                text-[11px]
                font-medium
                text-[#c7c6df]
              "
            >
              Description
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Add more details"
              disabled={isPending}
              className="
                h-[42px]
                w-full
                rounded-[9px]
                border
                border-[#393861]
                bg-[#19183a]
                px-3
                text-[12px]
                text-white
                outline-none
                placeholder:text-[#72718d]
                focus:border-[#6668ed]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

          </div>

          {/* ================= OPTIONAL DETAILS ================= */}

          <button
            type="button"
            onClick={() =>
              setShowOptional(!showOptional)
            }
            disabled={isPending}
            className="
              mt-5
              flex
              items-center
              gap-2
              text-[11px]
              text-[#d1d0e7]
              disabled:opacity-50
            "
          >

            <ChevronDown
              size={15}
              className={`transition ${
                showOptional
                  ? "rotate-0"
                  : "-rotate-90"
              }`}
            />

            <span>
              Optional details
            </span>

          </button>

          {/* ================= OPTIONAL CONTENT ================= */}

          {showOptional && (
            <>

              {/* ================= DATE / TIME / PRIORITY ================= */}

              <div className="mt-3 grid grid-cols-3 gap-3">

                {/* DATE */}

                <div className="relative">

                  <CalendarDays
                    size={14}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#85849e]
                    "
                  />

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                    disabled={isPending}
                    className="
                      h-[36px]
                      w-full
                      appearance-none
                      rounded-[8px]
                      border
                      border-[#393861]
                      bg-[#19183a]
                      pl-9
                      pr-2
                      text-[10px]
                      text-[#85849e]
                      outline-none
                      focus:border-[#6668ed]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                </div>

                {/* TIME */}

                <div className="relative">

                  <Clock3
                    size={14}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#85849e]
                    "
                  />

                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) =>
                      setDueTime(e.target.value)
                    }
                    disabled={isPending}
                    className="
                      h-[36px]
                      w-full
                      appearance-none
                      rounded-[8px]
                      border
                      border-[#393861]
                      bg-[#19183a]
                      pl-9
                      pr-2
                      text-[10px]
                      text-[#85849e]
                      outline-none
                      focus:border-[#6668ed]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                </div>

                {/* PRIORITY */}

                <button
                  type="button"
                  onClick={() =>
                    setPriority(
                      priority === "high"
                        ? ""
                        : "high"
                    )
                  }
                  disabled={isPending}
                  className={`
                    flex
                    h-[36px]
                    w-full
                    items-center
                    gap-2
                    rounded-[8px]
                    border
                    px-3
                    text-[10px]
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${
                      priority
                        ? "border-[#6869ed] bg-[#30306b] text-white"
                        : "border-[#393861] bg-[#19183a] text-[#85849e]"
                    }
                  `}
                >

                  <Flag size={13} />

                  <span>
                    {priority || "Priority"}
                  </span>

                </button>

              </div>

              {/* ================= CHECKLIST ================= */}

              <div className="mt-5">

                <label
                  className="
                    mb-2
                    block
                    text-[11px]
                    font-medium
                    text-[#c7c6df]
                  "
                >
                  Checklist
                </label>

                <div className="space-y-2">

                  {checklist.map(
                    (item, index) => (

                      <div
                        key={`${item}-${index}`}
                        className="
                          group
                          flex
                          h-[46px]
                          items-center
                          rounded-[9px]
                          border
                          border-[#55547b]
                          bg-[#2b2a59]
                          px-3
                          transition
                          hover:border-[#6666a0]
                        "
                      >

                        {/* CHECKBOX */}

                        <button
                          type="button"
                          disabled={isPending}
                          className="
                            flex
                            h-[16px]
                            w-[16px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-[4px]
                            border
                            border-[#d6d6ec]
                            transition
                            hover:bg-[#6366ed]
                            disabled:opacity-50
                          "
                        >
                          <Check
                            size={11}
                            className="
                              text-white
                              opacity-0
                              group-hover:opacity-100
                            "
                          />
                        </button>

                        {/* ITEM */}

                        <span
                          className="
                            ml-2.5
                            text-[12px]
                            text-white
                          "
                        >
                          {item}
                        </span>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeChecklistItem(
                              index
                            )
                          }
                          disabled={isPending}
                          className="
                            ml-auto
                            text-[#8988a8]
                            transition
                            hover:text-red-400
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          <X size={14} />
                        </button>

                      </div>

                    )
                  )}

                </div>

                {/* ================= ADD CHECKLIST ================= */}

                <div className="mt-3 flex gap-2">

                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) =>
                      setNewChecklistItem(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleChecklistKeyDown
                    }
                    placeholder="Add checklist item..."
                    disabled={isPending}
                    className="
                      h-[38px]
                      flex-1
                      rounded-[8px]
                      border
                      border-[#393861]
                      bg-[#19183a]
                      px-3
                      text-[11px]
                      text-white
                      outline-none
                      placeholder:text-[#686781]
                      focus:border-[#6668ed]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={addChecklistItem}
                    disabled={
                      isPending ||
                      !newChecklistItem.trim()
                    }
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[8px]
                      bg-[#30306b]
                      text-[#a9a9ff]
                      transition
                      hover:bg-[#3b3b7c]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <Plus size={16} />
                  </button>

                </div>

              </div>

            </>
          )}

          {/* ================= ERROR ================= */}

          {errorMessage && (
            <div
              className="
                mt-4
                rounded-[8px]
                border
                border-red-500/20
                bg-red-500/10
                px-3
                py-2
                text-[11px]
                text-red-300
              "
            >
              {errorMessage}
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2.5
            border-t
            border-white/[0.04]
            px-8
            py-5
          "
        >

          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="
              h-[36px]
              rounded-full
              border
              border-[#6969bb]
              px-6
              text-[11px]
              font-medium
              text-white
              transition
              hover:bg-[#30305e]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* ADD TASK */}

          <button
            type="button"
            onClick={handleAddTask}
            disabled={
              !taskName.trim() ||
              isPending
            }
            className="
              h-[36px]
              rounded-full
              bg-[#6366ed]
              px-6
              text-[11px]
              font-medium
              text-white
              shadow-[0_5px_15px_rgba(99,102,237,0.25)]
              transition
              hover:bg-[#7476f5]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isPending
              ? "Creating..."
              : "Add Task"}
          </button>

        </div>

      </div>

    </div>
  );
}
