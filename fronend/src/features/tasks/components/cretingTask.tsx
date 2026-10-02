"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  Clock3,
  Flag,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";

import { useTaskUpdate } from "@/features/tasks/hooks/useTesk";

interface Task {
  _id?: string;
  id?: string;

  taskName: string;
  description?: string;

  dueDate?: string;
  dueTime?: string;

  priority?: string;

  checklist?: string[];

  project?: string;
}

interface EditTaskModalProps {
  task: Task;
  onClose?: () => void;
  onUpdated?: (task: Task) => void;
}

export default function EditTaskModal({
  task,
  onClose,
  onUpdated,
}: EditTaskModalProps) {
  // ============================================
  // FORM STATE
  // ============================================

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [priority, setPriority] = useState("");

  const [checklist, setChecklist] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const [showOptional, setShowOptional] = useState(true);

  const [selectedProject, setSelectedProject] = useState("No project");

  const [errorMessage, setErrorMessage] = useState("");

  // ============================================
  // UPDATE HOOK
  // ============================================

  const {
    mutateAsync: updateTask,
    isPending,
  } = useTaskUpdate();

  // ============================================
  // LOAD TASK
  // ============================================

  useEffect(() => {
    if (!task) return;

    setTaskName(task.taskName || "");
    setDescription(task.description || "");

    setDueDate(formatDateForInput(task.dueDate));
    setDueTime(formatTimeForInput(task.dueTime));

    setPriority(task.priority || "");

    setChecklist(
      Array.isArray(task.checklist) ? task.checklist : []
    );

    setSelectedProject(task.project || "No project");
  }, [task]);

  // ============================================
  // DATE FORMAT
  // ============================================

  const formatDateForInput = (date?: string) => {
    if (!date) return "";

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return "";
      }

      return parsedDate.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // ============================================
  // TIME FORMAT
  // ============================================

  const formatTimeForInput = (time?: string) => {
    if (!time) return "";

    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.substring(0, 5);
    }

    try {
      const parsedTime = new Date(time);

      if (Number.isNaN(parsedTime.getTime())) {
        return "";
      }

      return parsedTime.toTimeString().slice(0, 5);
    } catch {
      return "";
    }
  };

  // ============================================
  // CHECKLIST
  // ============================================

  const addChecklistItem = () => {
    const item = newChecklistItem.trim();

    if (!item) return;

    setChecklist((prev) => [...prev, item]);
    setNewChecklistItem("");
  };

  const removeChecklistItem = (index: number) => {
    setChecklist((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleChecklistKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChecklistItem();
    }
  };

  // ============================================
  // SAVE
  // ============================================

  const handleSaveChanges = async () => {
    if (!taskName.trim()) {
      const message = "Please enter a task name.";

      setErrorMessage(message);
      toast.error(message);

      return;
    }

    const taskId = task._id || task.id;

    if (!taskId) {
      const message = "Task ID is missing.";

      setErrorMessage(message);
      toast.error(message);

      return;
    }

    try {
      setErrorMessage("");

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
        formData.append("dueDate", dueDate);
      }

      if (dueTime) {
        formData.append("dueTime", dueTime);
      }

      if (priority) {
        formData.append("priority", priority);
      }

      formData.append(
        "checklist",
        JSON.stringify(checklist)
      );

      const response = await updateTask({
        taskId,
        data: formData,
      });

      console.log("✅ Task updated:", response);

      toast.success("Task updated successfully.");

      onUpdated?.({
        ...task,
        taskName: taskName.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        checklist,
        project: selectedProject,
      });

      onClose?.();
    } catch (error: any) {
      console.error("❌ Task update failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update task";

      setErrorMessage(message);
      toast.error(message);
    }
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* BACKDROP */}

      <div
        className="
          absolute inset-0
          bg-[#080719]/75
          backdrop-blur-[8px]
        "
        onClick={isPending ? undefined : onClose}
      />

      {/* MODAL */}

      <div
        className="
          relative
          flex
          h-[785px]
          w-[620px]
          max-w-[calc(100vw-32px)]
          flex-col
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.06]
          bg-[#252452]
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
        "
      >

        {/* =====================================
            HEADER
        ====================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            pt-6
            sm:px-7
            sm:pt-7
          "
        >
          <h2
            className="
              text-[26px]
              font-semibold
              tracking-[-0.5px]
              text-[#f0efff]
            "
          >
            Edit Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-[#9d9bbd]
              transition
              hover:bg-white/[0.05]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X
              size={21}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* =====================================
            FORM
        ====================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            pb-5
            pt-6
            scrollbar-none
            sm:px-7
          "
        >

          {/* TASK NAME */}

          <div>
            <label
              className="
                mb-2
                block
                text-[13px]
                font-medium
                text-[#c5c3dc]
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
                h-[60px]
                w-full
                rounded-[12px]
                border
                border-[#3b3a63]
                bg-[#1b1a3b]
                px-4
                text-[16px]
                text-white
                outline-none
                transition
                placeholder:text-[#777693]
                focus:border-[#6768ed]
                focus:ring-2
                focus:ring-[#6366ed]/10
              "
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">
            <label
              className="
                mb-2
                block
                text-[13px]
                font-medium
                text-[#c5c3dc]
              "
            >
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Add more details"
              disabled={isPending}
              rows={3}
              className="
                min-h-[86px]
                w-full
                resize-none
                rounded-[12px]
                border
                border-[#3b3a63]
                bg-[#1b1a3b]
                px-4
                py-4
                text-[15px]
                leading-6
                text-white
                outline-none
                transition
                placeholder:text-[#777693]
                focus:border-[#6768ed]
                focus:ring-2
                focus:ring-[#6366ed]/10
              "
            />
          </div>

          {/* =====================================
              PROJECTS
          ====================================== */}

          <div className="mt-5 flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setSelectedProject("No project")
              }
              disabled={isPending}
              className={`
                rounded-full
                px-4
                py-2
                text-[12px]
                font-medium
                transition
                ${
                  selectedProject === "No project"
                    ? "bg-[#6467ee] text-white"
                    : "bg-[#1c1b3d] text-[#9997b7] hover:bg-[#2c2b55]"
                }
              `}
            >
              No project
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedProject("Ilnklnlk")
              }
              disabled={isPending}
              className={`
                rounded-full
                px-4
                py-2
                text-[12px]
                font-medium
                transition
                ${
                  selectedProject === "Ilnklnlk"
                    ? "bg-[#6467ee] text-white"
                    : "bg-[#1c1b3d] text-[#9997b7] hover:bg-[#2c2b55]"
                }
              `}
            >
              Ilnklnlk
            </button>

          </div>

          {/* =====================================
              OPTIONAL DETAILS
          ====================================== */}

          <button
            type="button"
            onClick={() =>
              setShowOptional(!showOptional)
            }
            disabled={isPending}
            className="
              mt-6
              flex
              items-center
              gap-2
              text-[14px]
              font-medium
              text-[#d1d0e7]
            "
          >
            <ChevronDown
              size={17}
              className={`
                transition-transform
                ${
                  showOptional
                    ? "rotate-0"
                    : "-rotate-90"
                }
              `}
            />

            <span>Optional details</span>
          </button>

          {showOptional && (
            <div className="mt-4">

              {/* DATE + TIME */}

              <div className="grid grid-cols-2 gap-3">

                {/* DATE */}

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#9694b3]
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
                      h-[50px]
                      w-full
                      rounded-[12px]
                      border
                      border-[#3b3a63]
                      bg-[#1b1a3b]
                      pl-11
                      pr-3
                      text-[13px]
                      text-[#b9b7cf]
                      outline-none
                      transition
                      focus:border-[#6768ed]
                    "
                  />
                </div>

                {/* TIME */}

                <div className="relative">
                  <Clock3
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#9694b3]
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
                      h-[50px]
                      w-full
                      rounded-[12px]
                      border
                      border-[#3b3a63]
                      bg-[#1b1a3b]
                      pl-11
                      pr-3
                      text-[13px]
                      text-[#b9b7cf]
                      outline-none
                      transition
                      focus:border-[#6768ed]
                    "
                  />
                </div>

              </div>

              {/* =================================
                  PRIORITY
              ================================== */}

              <div
                className="
                  mt-3
                  flex
                  h-[50px]
                  w-full
                  items-center
                  rounded-[12px]
                  bg-[#1b1a3b]
                  p-1
                "
              >

                <div className="flex items-center px-4">
                  <Flag
                    size={17}
                    className="text-[#9290ad]"
                  />
                </div>

                {["low", "medium", "high"].map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setPriority(
                          priority === level
                            ? ""
                            : level
                        )
                      }
                      disabled={isPending}
                      className={`
                        flex
                        h-full
                        flex-1
                        items-center
                        justify-center
                        rounded-[9px]
                        text-[13px]
                        capitalize
                        transition
                        ${
                          priority === level
                            ? "bg-[#30306a] text-white"
                            : "text-[#85839f] hover:text-white"
                        }
                      `}
                    >
                      {level}
                    </button>
                  )
                )}

              </div>

              {/* =================================
                  CHECKLIST
              ================================== */}

              <div className="mt-6">

                <label
                  className="
                    mb-3
                    block
                    text-[13px]
                    font-medium
                    text-[#c5c3dc]
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
                          min-h-[50px]
                          items-center
                          rounded-[11px]
                          border
                          border-[#45446c]
                          bg-[#2b2a59]
                          px-4
                        "
                      >

                        {/* CHECKBOX */}

                        <button
                          type="button"
                          disabled={isPending}
                          className="
                            flex
                            h-[20px]
                            w-[20px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-[6px]
                            border
                            border-[#55547d]
                            transition
                            hover:border-[#6768ed]
                            hover:bg-[#6366ed]
                          "
                        >
                          <Check
                            size={13}
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
                            ml-3
                            text-[14px]
                            text-[#eeeefe]
                          "
                        >
                          {item}
                        </span>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeChecklistItem(index)
                          }
                          disabled={isPending}
                          className="
                            ml-auto
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            text-[#8583a2]
                            transition
                            hover:bg-white/[0.05]
                            hover:text-red-400
                          "
                        >
                          <X size={15} />
                        </button>

                      </div>
                    )
                  )}

                </div>

                {/* ADD CHECKLIST */}

                <div
                  className="
                    mt-2
                    flex
                    min-h-[50px]
                    items-center
                    rounded-[11px]
                    border
                    border-[#353456]
                    bg-[#1b1a3b]
                    px-4
                  "
                >

                  <Plus
                    size={18}
                    className="text-[#7d7ba0]"
                  />

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
                    placeholder="Add a checklist item"
                    disabled={isPending}
                    className="
                      ml-3
                      flex-1
                      bg-transparent
                      text-[14px]
                      text-white
                      outline-none
                      placeholder:text-[#686783]
                    "
                  />

                  {newChecklistItem.trim() && (
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      disabled={isPending}
                      className="
                        text-[12px]
                        font-medium
                        text-[#7476f2]
                        hover:text-[#9698ff]
                      "
                    >
                      Add
                    </button>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ERROR */}

          {errorMessage && (
            <div
              className="
                mt-4
                rounded-[10px]
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-[12px]
                text-red-300
              "
            >
              {errorMessage}
            </div>
          )}

        </div>

        {/* =====================================
            FOOTER
        ====================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-white/[0.05]
            px-6
            py-5
            sm:px-7
          "
        >

          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="
              h-[52px]
              rounded-full
              border
              border-[#4b4a73]
              px-7
              text-[14px]
              font-medium
              text-[#d0cfe3]
              transition
              hover:bg-white/[0.04]
              hover:text-white
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={
              !taskName.trim() || isPending
            }
            className="
              h-[52px]
              min-w-[170px]
              rounded-full
              bg-[#6265ed]
              px-7
              text-[14px]
              font-semibold
              text-white
              shadow-[0_8px_25px_rgba(99,102,237,0.28)]
              transition
              hover:bg-[#7375f4]
              hover:shadow-[0_10px_30px_rgba(99,102,237,0.38)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isPending
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}