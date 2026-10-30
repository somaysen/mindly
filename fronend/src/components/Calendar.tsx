"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CreateTaskModal from "@/features/tasks/components/TaskCreteModel";
import TaskModel from "@/features/tasks/components/TaskModel";
import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";
import "react-day-picker/style.css";
import "./calendar.css";

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const taskDateKey = (value: string | null) => {
  if (!value) return null;

  const datePart = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : dateKey(parsed);
};

export default function Calendar() {
  const tasksQuery = useTaskGet();
  const today = new Date();
  const [selected, setSelected] = useState<Date>(today);
  const [month, setMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const taskDates = (tasksQuery.data?.data ?? []).flatMap((task) => {
    const key = taskDateKey(task.dueDate);
    if (!key) return [];

    const [year, month, day] = key.split("-").map(Number);
    return [new Date(year, month - 1, day)];
  });

  return (
    <div className="mindly-calendar-wrapper">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (!date) return;
          setSelected(date);
          if (tasksQuery.isLoading) {
            setSelectedTask(null);
            setModalDate(null);
            return;
          }
          const selectedDateKey = dateKey(date);
          const taskOnDate = (tasksQuery.data?.data ?? []).find(
            (task) => taskDateKey(task.dueDate) === selectedDateKey,
          );

          if (taskOnDate) {
            setModalDate(null);
            setSelectedTask(taskOnDate);
          } else {
            setSelectedTask(null);
            setModalDate(selectedDateKey);
          }
        }}
        month={month}
        onMonthChange={setMonth}
        today={today}
        showOutsideDays={false}
        weekStartsOn={1}
        className="mindly-calendar"
        modifiers={{ hasTask: taskDates }}
        modifiersClassNames={{ hasTask: "mindly-has-task" }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft size={20} aria-hidden="true" />
            ) : (
              <ChevronRight size={20} aria-hidden="true" />
            ),
        }}
        formatters={{
          formatWeekdayName: (date) => {
            const day = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const names: Record<string, string> = {
              Mon: "M",
              Tue: "T",
              Wed: "W",
              Thu: "Th",
              Fri: "F",
              Sat: "Sa",
              Sun: "S",
            };
            return names[day] ?? day;
          },
        }}
      />
      {modalDate && (
        <CreateTaskModal
          dueDate={modalDate}
          onClose={() => setModalDate(null)}
        />
      )}
      {selectedTask && (
        <TaskModel
          key={selectedTask._id}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdated={() => setSelectedTask(null)}
          onDeleted={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
