"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Navber/Topbar";
import DashboardSidebar from "./DashboradSidbar";
import DashbordCenter from "./DashbordCenter";
import { useGetUserByAuthID } from "@/features/dashboard/hooks/useDashboard";

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
        Loading your dashboard...
      </main>
    );
  }

  // User exists: show dashboard
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0d0c1f]">
      <aside className="fixed left-8 top-5 z-50 h-screen w-[260px]">
        <DashboardSidebar />
      </aside>

      <div className="ml-[260px] h-screen">
        {/* Fixed Topbar */}
        <div className="fixed left-[350px] right-5 top-2 z-50">
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <main className="ml-[90px] mr-[18px] h-screen overflow-y-auto pt-[130px] scrollbar-hide">
          <DashbordCenter />
        </main>
      </div>
    </div>
  );
}
