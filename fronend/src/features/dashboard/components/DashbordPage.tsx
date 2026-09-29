"use client";

import React from "react";

import DashboradSidbar from "@/features/dashboard/components/DashboradSidbar";
import Topbar from "@/features/dashboard/components/Topbar";
import DashbordCenter from "./DashbordCenter";

function Page() {
  return (
    <div className="min-h-screen w-full bg-[#0d0c20] px-3 py-3 text-white sm:px-5 sm:py-5 lg:px-7">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1590px] gap-8">
        {/* LEFT SIDEBAR */}
        <DashboradSidbar />

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-[22px]">
            {/* TOPBAR */}
            <Topbar />

            {/* DASHBOARD CENTER */}
            <DashbordCenter />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;