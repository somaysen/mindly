
"use client";

import { useState } from "react";
import { Check, Clock3, X } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TimePicker({
  value,
  onChange,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");

  const getInitial = () => {
    const [h, m] = value ? value.split(":").map(Number) : [9, 0];
    return {
      hour: h % 12 || 12,
      minute: m,
      period: h >= 12 ? "PM" as const : "AM" as const,
    };
  };

  const initial = getInitial();

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(initial.period);

  const displayTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  const outputTime = `${String(period === "PM" ? hour % 12 + 12 : hour % 12).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  const openPicker = () => {
    const [h, m] = value ? value.split(":").map(Number) : [9, 0];
    setHour(h % 12 || 12);
    setMinute(m);
    setPeriod(h >= 12 ? "PM" : "AM");
    setMode("hour");
    setOpen(true);
  };

  const numbers =
    mode === "hour"
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i * 5);

  const selected = mode === "hour" ? hour : minute;
  const angle = mode === "hour" ? (hour % 12) * 30 : minute * 6;

  const save = () => {
    onChange(outputTime);
    setOpen(false);
  };

  return (
    <>
      {/* Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={openPicker}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[#3b3a63] bg-[#1b1a3b] px-3 transition hover:border-[#7779ff] disabled:opacity-50"
      >
        <span className="flex items-center gap-2 text-sm text-white">
          <Clock3 size={17} className="text-[#9294ff]" />
          {value
            ? `${displayTime} ${period}`
            : "Select time"}
        </span>
        <span className="text-xs text-[#9294ff]">Change</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-[#080719]/80 p-3 backdrop-blur-sm">
          <div className="w-full max-w-[350px] overflow-hidden rounded-[24px] border border-white/10 bg-[#24234b] shadow-[0_25px_80px_#0009]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[2px] text-[#9294ff]">
                  TASK SCHEDULER
                </p>
                <h3 className="mt-1 text-base font-semibold text-white">
                  Select due time
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/5 p-2 text-white/60 hover:bg-white/10"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5">

              {/* Digital display */}
              <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-[#7779ff]/20 bg-[#19183a] px-4 py-5">
                <button
                  type="button"
                  onClick={() => setMode("hour")}
                  className={`text-5xl font-bold tracking-tight tabular-nums transition ${
                    mode === "hour" ? "text-[#a5a7ff]" : "text-white/50"
                  }`}
                >
                  {String(hour).padStart(2, "0")}
                </button>

                <span className="animate-pulse text-4xl text-white/30">:</span>

                <button
                  type="button"
                  onClick={() => setMode("minute")}
                  className={`text-5xl font-bold tracking-tight tabular-nums transition ${
                    mode === "minute" ? "text-[#a5a7ff]" : "text-white/50"
                  }`}
                >
                  {String(minute).padStart(2, "0")}
                </button>

                <div className="ml-2 flex flex-col gap-2">
                  {(["AM", "PM"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${
                        period === p
                          ? "bg-[#686af0] text-white shadow-lg"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode selector */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium text-white/50">
                  {mode === "hour" ? "SELECT HOUR" : "SELECT MINUTES"}
                </span>

                <div className="flex rounded-lg bg-[#19183a] p-1">
                  <button
                    type="button"
                    onClick={() => setMode("hour")}
                    className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                      mode === "hour"
                        ? "bg-[#686af0] text-white"
                        : "text-white/50"
                    }`}
                  >
                    Hour
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("minute")}
                    className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                      mode === "minute"
                        ? "bg-[#686af0] text-white"
                        : "text-white/50"
                    }`}
                  >
                    Minute
                  </button>
                </div>
              </div>

              {/* Analog clock */}
              <div className="flex justify-center">
                <div className="relative aspect-square w-full max-w-[270px] rounded-full border border-[#7779ff]/20 bg-[radial-gradient(circle,#302f60_0%,#1b1a3b_72%)] shadow-[inset_0_0_35px_#08071980]">

                  {/* Dial markings */}
                  {Array.from({ length: 60 }, (_, i) => (
                    <div
                      key={i}
                      className={`absolute left-1/2 top-1/2 ${
                        i % 5 === 0
                          ? "h-2 w-[2px] bg-[#9294ff]/70"
                          : "h-1 w-px bg-white/15"
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-121px)`,
                      }}
                    />
                  ))}

                  {/* Clock hand */}
                  <div
                    className="absolute left-1/2 top-1/2 z-10 h-[90px] w-[2px] origin-bottom rounded-full bg-gradient-to-t from-[#9294ff] to-[#c5c6ff] transition-transform duration-300"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                    }}
                  />

                  {/* Clock center */}
                  <div className="absolute left-1/2 top-1/2 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#c0c1ff] bg-[#686af0] shadow-[0_0_15px_#7779ff]" />

                  {/* Numbers */}
                  {numbers.map((n, index) => {
                    const radians = (index * 30 - 90) * Math.PI / 180;
                    const radius = 105;

                    const x = 135 + Math.cos(radians) * radius;
                    const y = 135 + Math.sin(radians) * radius;

                    const active = selected === n;

                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          if (mode === "hour") {
                            setHour(n);
                            setMode("minute");
                          } else {
                            setMinute(n);
                          }
                        }}
                        style={{
                          left: x,
                          top: y,
                          transform: "translate(-50%, -50%)",
                        }}
                        className={`absolute z-20 flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${
                          active
                            ? "scale-110 bg-[#7779ff] text-white shadow-[0_0_20px_#7779ff99]"
                            : "text-white/75 hover:bg-white/10"
                        }`}
                      >
                        {mode === "minute"
                          ? String(n).padStart(2, "0")
                          : n}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-4 text-center text-[11px] text-white/40">
                {mode === "hour"
                  ? "Tap an hour to continue"
                  : "Tap a minute to set your time"}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-white/10 bg-[#1e1d40] p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 flex-1 rounded-xl border border-white/10 text-xs font-semibold text-white/65 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6265ed] to-[#8587ff] text-xs font-bold text-white shadow-lg shadow-[#6265ed]/20 transition hover:brightness-110"
              >
                <Check size={15} />
                Confirm {outputTime}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
