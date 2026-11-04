"use client";

import { type FormEvent, useState } from "react";
import { Share2, Trash2, UserPlus, X } from "lucide-react";
import {
  useGetCanvasMembers,
  useInviteCanvasMember,
  useRemoveCanvasMember,
  useUpdateCanvasMemberRole,
} from "@/features/canvas/hooks/useCanvas";
import { getApiErrorMessage } from "@/lib/apiError";
import type { CanvasRole } from "@/types/canvas";

type MemberRole = Exclude<CanvasRole, "owner">;

export default function CanvasShareControl({ canvasId }: { canvasId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("editor");
  const [operationError, setOperationError] = useState<string | null>(null);
  const membersQuery = useGetCanvasMembers(canvasId, isOpen);
  const inviteMember = useInviteCanvasMember(canvasId);
  const updateMemberRole = useUpdateCanvasMemberRole(canvasId);
  const removeMember = useRemoveCanvasMember(canvasId);
  const isPending =
    inviteMember.isPending ||
    updateMemberRole.isPending ||
    removeMember.isPending;

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) return;
    setOperationError(null);
    try {
      await inviteMember.mutateAsync({
        canvasId,
        email: normalizedEmail,
        role,
      });
      setEmail("");
    } catch (error) {
      setOperationError(
        getApiErrorMessage(error, "Could not invite this user."),
      );
    }
  };

  const handleRoleChange = async (memberId: string, value: string) => {
    if (value !== "editor" && value !== "viewer") return;
    setOperationError(null);
    try {
      await updateMemberRole.mutateAsync({
        canvasId,
        memberId,
        role: value,
      });
    } catch (error) {
      setOperationError(
        getApiErrorMessage(error, "Could not update this member's role."),
      );
    }
  };

  const handleRemove = async (memberId: string, memberEmail: string) => {
    if (!window.confirm(`Remove ${memberEmail} from this canvas?`)) return;
    setOperationError(null);
    try {
      await removeMember.mutateAsync({ canvasId, memberId });
    } catch (error) {
      setOperationError(
        getApiErrorMessage(error, "Could not remove this member."),
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOperationError(null);
          setIsOpen(true);
        }}
        className="flex h-9 items-center gap-2 rounded-full border border-violet-300/25 bg-violet-300/10 px-2 text-xs font-medium text-violet-100 transition hover:bg-violet-300/20 sm:px-3"
        aria-label="Share canvas"
      >
        <Share2 size={15} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="canvas-share-title"
            className="w-full max-w-lg rounded-2xl border border-[#39365f] bg-[#15142d] p-5 text-white shadow-2xl sm:p-6"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 id="canvas-share-title" className="text-lg font-semibold">
                  Share canvas
                </h2>
                <p className="mt-1 text-xs text-[#aaa7c5]">
                  Invite registered users as editors or viewers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close sharing dialog"
                className="rounded-lg p-1 text-[#aaa7c5] hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleInvite} className="mt-5">
              <label
                htmlFor="canvas-member-email"
                className="block text-xs font-medium text-[#d0cde5]"
              >
                Email address
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="canvas-member-email"
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-[#39365f] bg-[#0d0c1f] px-3 text-sm outline-none placeholder:text-[#777493] focus:border-[#7777ff]"
                />
                <select
                  value={role}
                  onChange={(event) => {
                    if (
                      event.target.value === "editor" ||
                      event.target.value === "viewer"
                    ) {
                      setRole(event.target.value);
                    }
                  }}
                  aria-label="Role for invited user"
                  className="h-10 rounded-lg border border-[#39365f] bg-[#0d0c1f] px-3 text-sm outline-none focus:border-[#7777ff]"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  disabled={isPending || !email.trim()}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#5757ed] px-4 text-sm font-medium hover:bg-[#6868f5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserPlus size={15} />
                  Invite
                </button>
              </div>
            </form>

            {operationError && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-300/20 bg-red-950/30 px-3 py-2 text-xs text-red-100"
              >
                {operationError}
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#aaa7c5]">
                People with access
              </h3>
              {membersQuery.isLoading ? (
                <p className="mt-3 text-sm text-white/60">Loading members...</p>
              ) : membersQuery.isError ? (
                <div className="mt-3 text-sm text-red-100">
                  <p>{getApiErrorMessage(membersQuery.error)}</p>
                  <button
                    type="button"
                    onClick={() => void membersQuery.refetch()}
                    className="mt-2 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <ul className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                  {(membersQuery.data || []).map((member) => (
                    <li
                      key={member.userId}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {member.email || member.userId}
                      </span>
                      {member.role === "owner" ? (
                        <span className="text-xs text-[#aaa7c5]">Owner</span>
                      ) : (
                        <>
                          <select
                            value={member.role}
                            onChange={(event) =>
                              void handleRoleChange(
                                member.userId,
                                event.target.value,
                              )
                            }
                            disabled={isPending}
                            aria-label={`Role for ${member.email}`}
                            className="h-8 rounded-lg border border-[#39365f] bg-[#0d0c1f] px-2 text-xs outline-none focus:border-[#7777ff] disabled:opacity-50"
                          >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              void handleRemove(member.userId, member.email)
                            }
                            disabled={isPending}
                            aria-label={`Remove ${member.email}`}
                            className="rounded-lg p-2 text-[#aaa7c5] hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
