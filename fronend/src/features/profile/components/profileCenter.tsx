"use client";

import React from "react";
import { Pencil, LogOut } from "lucide-react";
import ProfileRight from "./profileRight";

function ProfileCenter() {
  return (
    <div className="min-h-screen w-full px-8 py-6 text-white">
      {/* Header */}
      <h1 className="mb-8 text-3xl font-semibold">
        Settings
      </h1>

      {/* ================= TWO PARTS ================= */}
      <div className="grid w-full grid-cols-1 items-start gap-8 xl:grid-cols-2">

        {/* ================= LEFT PART ================= */}
        <div className="w-full">
          {/* Profile */}
          <h2 className="mb-3 text-lg text-[#b5b2d0]">
            Profile
          </h2>

          {/* Profile Card */}
          <div className="flex min-h-[140px] w-full items-center justify-between rounded-2xl bg-[#1a1938] p-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#294c3c] text-3xl">
                🦌
              </div>

              <div>
                <h3 className="text-lg font-medium">
                  Somya
                </h3>

                <p className="text-sm text-[#8885a8]">
                  somyasen656@gmail.com
                </p>

                <p className="mt-1 text-sm text-[#8885a8]">
                  Member since September 2026
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              className="flex shrink-0 items-center gap-2 rounded-full border border-[#34335d] px-5 py-2 text-sm transition hover:bg-[#292751]"
            >
              <Pencil size={15} />
              Edit
            </button>
          </div>

          {/* Stats */}
          <div className="mt-3 grid w-full grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#1a1938] p-5">
              <h3 className="text-2xl font-semibold">
                2
              </h3>

              <p className="mt-1 text-sm text-[#777493]">
                Tasks completed
              </p>
            </div>

            <div className="rounded-2xl bg-[#1a1938] p-5">
              <h3 className="text-2xl font-semibold">
                1
              </h3>

              <p className="mt-1 text-sm text-[#777493]">
                Thoughts captured
              </p>
            </div>

            <div className="rounded-2xl bg-[#1a1938] p-5">
              <h3 className="text-2xl font-semibold">
                0
              </h3>

              <p className="mt-1 text-sm text-[#777493]">
                Focus sessions
              </p>
            </div>
          </div>

          {/* Account */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg text-[#b5b2d0]">
              Account
            </h2>

            <button
              className="flex items-center gap-2 rounded-full bg-[#ff5d61] px-7 py-3 text-base font-medium transition hover:bg-[#ff4b50]"
            >
              <LogOut size={17} />
              Log out
            </button>

            <p className="mt-3 max-w-lg text-sm text-[#777493]">
              Your data stays on this device — logging out
              just ends this session.
            </p>
          </div>
        </div>

        {/* ================= RIGHT PART ================= */}
        <div className="w-full">
          <ProfileRight />
        </div>
      </div>
    </div>
  );
}


export default ProfileCenter;