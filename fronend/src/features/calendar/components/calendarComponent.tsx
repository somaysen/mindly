"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";
import CreateTaskModal from "@/features/tasks/components/CreateTaskModal";
import "./calender.css";

type CalendarView = "month" | "week" | "day";

const pad = (value: number) => String(value).padStart(2, "0");
const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const startOfWeek = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
};
const sameDate = (left: Date, right: Date) => dateKey(left) === dateKey(right);
const parseDueDate = (value: string | null) => {
  if (!value) return null;
  const parts = value.slice(0, 10).split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};
const formatTime = (value: string | null) => {
  if (!value) return "Any time";
  const [hourText, minuteText = "00"] = value.split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour)) return value;
  return `${hour % 12 || 12}:${minuteText.slice(0, 2)} ${hour >= 12 ? "pm" : "am"}`;
};

function CalendarComponent({ selectedDate, onDateSelect, showTasks }: { selectedDate: Date; onDateSelect: (date: Date | ((current: Date) => Date)) => void; showTasks: boolean }) {
  const [view, setView] = useState<CalendarView>("week");
  const [createTask, setCreateTask] = useState(false);
  const { data, isLoading, isError } = useTaskGet();
  const tasks = useMemo(() => {
    const allTasks = data?.data ?? [];
    return showTasks ? allTasks : [];
  }, [data, showTasks]);

  const visibleDays = useMemo(() => {
    if (view === "day") return [new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())];
    if (view === "week") return Array.from({ length: 7 }, (_, index) => {
      const day = startOfWeek(selectedDate);
      day.setDate(day.getDate() + index);
      return day;
    });
    const first = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const gridStart = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      return day;
    });
  }, [selectedDate, view]);

  const movePeriod = (amount: number) => {
    onDateSelect((current) => {
      const next = new Date(current.getTime());
      if (view === "month") {
        const targetMonth = new Date(next.getFullYear(), next.getMonth() + amount, 1);
        const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
        targetMonth.setDate(Math.min(next.getDate(), lastDay));
        return targetMonth;
      }
      else next.setDate(next.getDate() + amount * (view === "week" ? 7 : 1));
      return next;
    });
  };

  const periodTitle = view === "day"
    ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const tasksForDay = (day: Date) => tasks.filter((task) => {
    const dueDate = parseDueDate(task.dueDate);
    return dueDate ? sameDate(dueDate, day) : false;
  });

  return (
    <div className="mindly-calendar-panel">
      <header className="mindly-calendar-toolbar">
        <div className="mindly-calendar-heading">
          <h1>{periodTitle}</h1>
          <button type="button" className="mindly-today-button" onClick={() => onDateSelect(new Date())}>Today</button>
          <div className="mindly-period-nav">
            <button type="button" aria-label="Previous period" onClick={() => movePeriod(-1)}><ChevronLeft size={19} /></button>
            <button type="button" aria-label="Next period" onClick={() => movePeriod(1)}><ChevronRight size={19} /></button>
          </div>
        </div>
        <div className="mindly-calendar-actions">
          <div className="mindly-view-switch" aria-label="Calendar view">
            {(["month", "week", "day"] as CalendarView[]).map((item) => (
              <button key={item} type="button" className={view === item ? "active" : ""} onClick={() => setView(item)}>{item[0].toUpperCase() + item.slice(1)}</button>
            ))}
          </div>
          <button type="button" className="mindly-add-task" onClick={() => setCreateTask(true)}><Plus size={17} /> Add task</button>
        </div>
      </header>

      {isLoading && <div className="mindly-calendar-message">Loading your tasks…</div>}
      {isError && <div className="mindly-calendar-message error">Tasks could not be loaded. Please try again later.</div>}

      {view === "month" ? (
        <div className="mindly-month-grid">
          {visibleDays.slice(0, 7).map((day, index) => <div key={index} className="mindly-month-weekday">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>)}
          {visibleDays.map((day) => {
            const dayTasks = tasksForDay(day);
            return <button key={dateKey(day)} type="button" onClick={() => { onDateSelect(day); setView("day"); }} className={`mindly-month-cell ${day.getMonth() !== selectedDate.getMonth() ? "outside" : ""} ${sameDate(day, new Date()) ? "today" : ""}`}>
              <span className="mindly-month-number">{day.getDate()}</span>
              <span className="mindly-month-items">{dayTasks.slice(0, 3).map((task) => <span key={task._id} className={`mindly-task-chip ${task.priority} ${task.status === "completed" ? "completed" : ""}`} title={task.taskName}>{task.taskName}</span>)}{dayTasks.length > 3 && <span className="mindly-more-count">+{dayTasks.length - 3} more</span>}</span>
            </button>;
          })}
        </div>
      ) : (
        <div className="mindly-agenda-scroll">
          <div className={`mindly-agenda ${view === "day" ? "single-day" : ""}`} style={{ "--day-count": visibleDays.length } as CSSProperties}>
            <div className="mindly-agenda-days"><div className="mindly-time-spacer" />{visibleDays.map((day) => <button key={dateKey(day)} type="button" className={`mindly-agenda-day ${sameDate(day, selectedDate) ? "selected" : ""} ${sameDate(day, new Date()) ? "today" : ""}`} onClick={() => onDateSelect(day)}><span>{day.toLocaleDateString("en-US", { weekday: "short" })}</span><strong>{day.getDate()}</strong></button>)}</div>
            <div className="mindly-agenda-body">
              <div className="mindly-time-labels">{Array.from({ length: 13 }, (_, index) => <div key={index}>{index + 7 > 12 ? `${index - 5} pm` : `${index + 7} am`}</div>)}</div>
              <div className="mindly-agenda-columns">{visibleDays.map((day) => {
                const dayTasks = tasksForDay(day);
                const timed = dayTasks.filter((task) => task.dueTime);
                const anytime = dayTasks.filter((task) => !task.dueTime);
                return <div key={dateKey(day)} className="mindly-agenda-column">
                  <div className="mindly-all-day-tasks">{anytime.map((task) => <TaskCard key={task._id} task={task} onClick={() => { onDateSelect(day); setView("day"); }} />)}</div>
                  <div className="mindly-hour-lines">{Array.from({ length: 13 }, (_, index) => <div key={index} />)}</div>
                  {timed.map((task) => <TimedTask key={task._id} task={task} onClick={() => { onDateSelect(day); setView("day"); }} />)}
                </div>;
              })}</div>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !isError && tasks.length === 0 && <div className="mindly-calendar-empty">No upcoming tasks to show. Add a task or turn on Daily tasks.</div>}
      {createTask && <CreateTaskModal dueDate={dateKey(selectedDate)} onClose={() => setCreateTask(false)} />}
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return <button type="button" className={`mindly-event-card ${task.priority} ${task.status === "completed" ? "completed" : ""}`} onClick={onClick}><strong>{task.taskName}</strong><span>{task.dueTime ? formatTime(task.dueTime) : "Task · Any time"}</span></button>;
}

function TimedTask({ task, onClick }: { task: Task; onClick: () => void }) {
  const [hours = "8", minutes = "0"] = (task.dueTime ?? "08:00").split(":");
  const totalMinutes = Number(hours) * 60 + Number(minutes);
  const top = Math.max(0, ((totalMinutes - 7 * 60) / 60) * 68);
  return <button type="button" className={`mindly-timed-task ${task.priority} ${task.status === "completed" ? "completed" : ""}`} style={{ top: `${top}px` }} onClick={onClick}><strong>{task.taskName}</strong><span>{formatTime(task.dueTime)}</span></button>;
}

export { CalendarComponent };
