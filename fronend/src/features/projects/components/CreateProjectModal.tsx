"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  FolderKanban,
  CheckSquare,
  Lightbulb,
} from "lucide-react";

export type ProjectFormData = {
  name: string;
  description: string;
  useTasks: boolean;
  useIdeas: boolean;
};

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: ProjectFormData) => void | Promise<void>;
  isSubmitting?: boolean;
};

const initialFormData: ProjectFormData = {
  name: "",
  description: "",
  useTasks: true,
  useIdeas: true,
};

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
  isSubmitting = false,
}: CreateProjectModalProps) {
  const [formData, setFormData] =
    useState<ProjectFormData>(initialFormData);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || isSubmitting) return;

    try {
      await onCreate({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      setFormData(initialFormData);
    } catch {
      // Keep the entered values so the user can retry.
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="w-full max-w-[480px] rounded-2xl border border-[#35325f] bg-[#15142d] p-5 text-white shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5757ed]/15 text-[#9292ff]">
              <FolderKanban size={23} />
            </div>

            <div>
              <h2
                id="create-project-title"
                className="text-[19px] font-semibold"
              >
                Create New Project
              </h2>
              <p className="mt-1 text-[12px] text-[#aaa7c5]">
                Bring your tasks and ideas together.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-[#aaa7c5] transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="project-name"
              className="mb-2 block text-[13px] font-medium"
            >
              Project Name <span className="text-red-400">*</span>
            </label>

            <input
              id="project-name"
              type="text"
              required
              autoFocus
              maxLength={100}
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g. Website Redesign"
              className="h-[45px] w-full rounded-xl border border-[#39365f] bg-[#0d0c1f] px-4 text-[13px] outline-none placeholder:text-[#777493] focus:border-[#7777ff] focus:ring-2 focus:ring-[#5757ed]/20"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-[13px] font-medium"
            >
              Description
            </label>

            <textarea
              id="project-description"
              rows={3}
              maxLength={1000}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="What is this project about?"
              className="w-full resize-none rounded-xl border border-[#39365f] bg-[#0d0c1f] px-4 py-3 text-[13px] outline-none placeholder:text-[#777493] focus:border-[#7777ff] focus:ring-2 focus:ring-[#5757ed]/20"
            />
          </div>

          {/* Tasks and Ideas */}
          <div>
            <p className="mb-3 text-[13px] font-medium">
              Include in your project
            </p>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#39365f] bg-[#1b1939]/70 p-3 transition hover:border-[#6464d9]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#5757ed]/15 text-[#9292ff]">
                  <CheckSquare size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-[13px] font-medium">Tasks</p>
                  <p className="mt-1 text-[11px] text-[#aaa7c5]">
                    Organize work and track progress.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={formData.useTasks}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      useTasks: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#6969f5]"
                />
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#39365f] bg-[#1b1939]/70 p-3 transition hover:border-[#6464d9]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                  <Lightbulb size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-[13px] font-medium">Ideas</p>
                  <p className="mt-1 text-[11px] text-[#aaa7c5]">
                    Keep project ideas and notes together.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={formData.useIdeas}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      useIdeas: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#6969f5]"
                />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[#302d50] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-[42px] rounded-full border border-[#45427c] px-5 text-[13px] font-medium text-[#d0cde5] transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
                  disabled={!formData.name.trim() || isSubmitting}
              className="flex h-[42px] items-center gap-2 rounded-full bg-[#5757ed] px-5 text-[13px] font-medium transition hover:bg-[#6868f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              {isSubmitting ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
