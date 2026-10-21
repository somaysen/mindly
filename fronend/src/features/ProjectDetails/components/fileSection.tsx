
"use client";

import { useState } from "react";
import { Plus, FileText, Image } from "lucide-react";

function FileSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-[#292750] bg-[#222147] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-medium text-white">Files</h2>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Add file"
            className="flex h-9 w-9 items-center justify-center rounded-full
            border border-[#46436e] text-[#aaa7ff] transition hover:bg-[#353260]"
          >
            <Plus
              size={20}
              className={`transition-transform ${open ? "rotate-45" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 w-48 rounded-xl
              border border-[#39365f] bg-[#19182f] p-1.5 shadow-xl">
              <button
                onClick={() => {
                  setOpen(false);
                  console.log("Add Text File");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm text-gray-200 hover:bg-[#302e55]"
              >
                <FileText size={17} className="text-[#aaa7ff]" />
                Add Text File
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  console.log("Add Illustrator");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm text-gray-200 hover:bg-[#302e55]"
              >
                <Image size={17} className="text-orange-300" />
                Add Illustrator
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="rounded-xl border border-dashed border-[#514e76]
        px-4 py-7 text-center text-sm text-[#aaa7c5]">
        No files added yet.
      </p>
    </section>
  );
}

export default FileSection;
