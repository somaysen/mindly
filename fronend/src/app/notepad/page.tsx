"use client";

import dynamic from "next/dynamic";

const Notepad = dynamic(
  () => import("@/features/Notepad/components/notepad"),
  {
    ssr: false,
    loading: () => (
      <main className="flex min-h-screen items-center justify-center bg-black text-sm text-white/60">
        Loading notepad...
      </main>
    ),
  },
);

export default function NotepadPage() {
  return <Notepad />;
}
