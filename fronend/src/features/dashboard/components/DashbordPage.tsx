"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Navber/Topbar";
import DashboardSidebar from "./DashboradSidbar";
import type { DashboardView } from "./DashboradSidbar";
import DashbordCenter from "./DashbordCenter";
import { useGetUserByAuthID } from "@/features/dashboard/hooks/useDashboard";
import Loading from "@/app/loading";

function getUserId(userInfo: unknown): string | null {
  if (!userInfo || typeof userInfo !== "object") return null;

  const response = userInfo as Record<string, any>;

  const candidates = [
    response,
    response.user,
    response.data,
    response.data?.user,
    response.data?.data,
    response.data?.data?.user,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;

    const id = candidate.id ?? candidate._id ?? candidate.userId;

    if (id !== undefined && id !== null && String(id).trim()) {
      return String(id);
    }
  }

  return null;
}

export default function DashbordPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>("home");

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useGetUserByAuthID();

  const userId = getUserId(userInfo);

  useEffect(() => {
    if (isLoading) return;

    if (isError || !userId) {
      router.replace("/onboarding/username");
    }
  }, [isLoading, isError, userId, router]);

  // Wait until the API response is checked
  if (isLoading || isError || !userId) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0d0c1f] text-sm text-white/70">
        <Loading/>
      </main>
    );
  }

  // User exists: show dashboard
  return (
    <div className="h-dvh w-full overflow-hidden bg-[#0d0c1f]">
      <aside className="fixed left-8 top-5 z-50 hidden h-screen w-[291px] xl:block">
        <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
      </aside>

      <div className="h-full xl:ml-[291px]">
        {/* Fixed Topbar */}
        <div className="fixed left-3 right-3 top-0 z-50 xl:left-[350px] xl:right-5 xl:top-2">
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <main className="h-full overflow-y-auto px-3 pb-24 pt-[88px] scrollbar-hide sm:px-5 sm:pt-[100px] xl:ml-[90px] xl:mr-[18px] xl:px-0 xl:pb-6 xl:pt-[130px]">
          <DashbordCenter activeView={activeView} />
        </main>
      </div>
    </div>
  );
}
