"use client";

import React from "react";
import { Bell } from "lucide-react";

function NotificationCenter() {
  return (
    <main className="min-h-[calc(100vh-82px)] w-full px-8 pb-10">
      {/* ================= HEADER ================= */}
      <div className="mb-7">
        <h1 className="text-[32px] font-semibold leading-tight text-[#e8e7f5]">
          Notifications
        </h1>

        <p className="mt-2 text-[17px] text-[#8582a8]">
          Reminders pulled from your tasks, events and thoughts.
        </p>
      </div>

      {/* ================= EMPTY NOTIFICATION CARD ================= */}
      <div
        className="
          flex
          min-h-[188px]
          w-full
          items-center
          justify-center
          rounded-[18px]
          bg-[#1a1938]
        "
      >
        <div className="flex flex-col items-center justify-center">
          {/* Bell Icon Box */}
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-[14px]
              border
              border-[#30305b]
              bg-[#1a1938]
            "
          >
            <Bell
              size={20}
              strokeWidth={1.6}
              className="text-[#77759d]"
            />
          </div>

          {/* Empty State Text */}
          <p className="mt-4 text-[17px] font-normal text-[#8c89b0]">
            You're all caught up.
          </p>
        </div>
      </div>
    </main>
  );
}

export default NotificationCenter;