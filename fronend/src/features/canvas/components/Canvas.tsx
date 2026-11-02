"use client";

import { useEffect, useState } from "react";
import MindlyCanvas from "./MindlyCanvas";
import Topbar from "@/components/Navber/Topbar";

type ThoughtSpace = {
  id: string;
  title: string;
};

const SPACES_STORAGE_KEY = "mindly-thought-spaces-v1";

export default function Canvas({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("Thought Space");

  useEffect(() => {
    try {
      const spaces = JSON.parse(
        localStorage.getItem(SPACES_STORAGE_KEY) ?? "[]",
      ) as ThoughtSpace[];
      const space = spaces.find((item) => item.id === projectId);
      if (space?.title) setTitle(space.title);
    } catch {
      // Keep the fallback title if saved space metadata is unavailable.
    }
  }, [projectId]);

  return (
    <main className="fixed inset-0 z-[100] flex h-dvh w-full flex-col overflow-hidden bg-black text-white">
      <div className="relative z-20 shrink-0 border-b border-[#000000]/80 bg-[#000000]/95 px-1 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6">
        <Topbar title={title} backHref="/thoughtSpaces" />
      </div>
      <section className="relative min-h-0 flex-1 overflow-hidden bg-black p-2 sm:p-3">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/[0.04] blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/[0.03] blur-[100px]" />
        </div>
        <div className="relative z-10 h-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_0_0_1px_rgba(0,0,0,0.4)]">
          <MindlyCanvas projectId={projectId} />
        </div>
      </section>
    </main>
  );
}
