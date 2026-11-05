
"use client";

import { type FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import {
  Share2,
  Trash2,
  UserPlus,
  X,
  Users,
  Crown,
  Shield,
  Eye,
  Loader2,
  Mail,
  Sparkles,
  Check,
} from "lucide-react";

import {
  useGetCanvasMembers,
  useInviteCanvasMember,
  useRemoveCanvasMember,
  useUpdateCanvasMemberRole,
} from "@/features/canvas/hooks/useCanvas";
import { useProfileInfo } from "@/features/profile/hooks/useProfile";

import { getApiErrorMessage } from "@/lib/apiError";
import type { CanvasRole } from "@/types/canvas";

type MemberRole = Exclude<CanvasRole, "owner">;

export default function CanvasShareControl({
  canvasId,
}: {
  canvasId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("editor");
  const [operationError, setOperationError] = useState<string | null>(null);

  const membersQuery = useGetCanvasMembers(canvasId, isOpen);
  const profileQuery = useProfileInfo();
  const inviteMember = useInviteCanvasMember(canvasId);
  const updateMemberRole = useUpdateCanvasMemberRole(canvasId);
  const removeMember = useRemoveCanvasMember(canvasId);

  const isPending =
    inviteMember.isPending ||
    updateMemberRole.isPending ||
    removeMember.isPending;

  const members = membersQuery.data || [];
  const currentProfile = profileQuery.data?.data;

  const getInitials = (email: string) =>
    email
      .split("@")[0]
      .split(/[._\s-]/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

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
        getApiErrorMessage(error, "Could not invite this user.")
      );
    }
  };

  const handleRoleChange = async (
    memberId: string,
    value: string
  ) => {
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
        getApiErrorMessage(error, "Could not update this member's role.")
      );
    }
  };

  const handleRemove = async (
    memberId: string,
    memberEmail: string
  ) => {
    if (!window.confirm(`Remove ${memberEmail} from this canvas?`)) return;

    setOperationError(null);

    try {
      await removeMember.mutateAsync({ canvasId, memberId });
    } catch (error) {
      setOperationError(
        getApiErrorMessage(error, "Could not remove this member.")
      );
    }
  };

  return (
    <>
      {/* Share Button */}
      <button
        type="button"
        onClick={() => {
          setOperationError(null);
          setIsOpen(true);
        }}
        className="group relative flex h-9 items-center gap-2 overflow-hidden rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 text-xs font-semibold text-violet-200 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/20 hover:shadow-lg hover:shadow-violet-500/10"
        aria-label="Share canvas"
      >
        <Share2
          size={15}
          className="transition-transform group-hover:rotate-12"
        />
        <span>Share</span>
      </button>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[200] grid place-items-center overflow-y-auto bg-[#05040d]/80 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="canvas-share-title"
            className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#111020] text-white shadow-[0_25px_100px_rgba(0,0,0,0.65)]"
          >
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-violet-600/15 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[90px]" />

            <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain p-5 sm:p-7">

              {/* Header */}
              <header className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10">
                    <Share2 size={21} className="text-violet-300" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        id="canvas-share-title"
                        className="text-lg font-bold tracking-tight"
                      >
                        Share canvas
                      </h2>
                      <Sparkles size={14} className="text-violet-400" />
                    </div>

                    <p className="mt-1 text-xs text-white/45">
                      Collaborate and create together.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close sharing dialog"
                  className="rounded-xl border border-white/5 bg-white/[0.04] p-2 text-white/50 transition hover:border-white/10 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Invite section */}
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <Mail size={14} className="text-violet-300" />
                  <h3 className="text-xs font-semibold text-white/80">
                    INVITE PEOPLE
                  </h3>
                </div>

                <form
                  onSubmit={handleInvite}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 sm:p-4"
                >
                  <label
                    htmlFor="canvas-member-email"
                    className="mb-2 block text-xs text-white/50"
                  >
                    Email address
                  </label>

                  <input
                    id="canvas-member-email"
                    type="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter email address..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0a17] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
                  />

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
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
                        className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#0b0a17] px-3 text-xs text-white/80 outline-none transition focus:border-violet-400/60"
                      >
                        <option value="editor">Editor — Can edit</option>
                        <option value="viewer">Viewer — Can view</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending || !email.trim()}
                      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {inviteMember.isPending ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <UserPlus size={15} />
                      )}
                      {inviteMember.isPending ? "Inviting..." : "Send invite"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Error */}
              {operationError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-200"
                >
                  {operationError}
                </p>
              )}

              {/* Members */}
              <div className="mt-7">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-violet-300" />
                    <h3 className="text-xs font-semibold text-white/80">
                      PEOPLE WITH ACCESS
                    </h3>
                  </div>

                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-300">
                    {members.length} {members.length === 1 ? "MEMBER" : "MEMBERS"}
                  </span>
                </div>

                {membersQuery.isLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-10">
                    <Loader2
                      size={24}
                      className="animate-spin text-violet-400"
                    />
                    <p className="mt-3 text-xs text-white/40">
                      Loading members...
                    </p>
                  </div>
                ) : membersQuery.isError ? (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-5 text-center">
                    <p className="text-sm text-red-200">
                      {getApiErrorMessage(membersQuery.error)}
                    </p>
                    <button
                      type="button"
                      onClick={() => void membersQuery.refetch()}
                      className="mt-3 text-xs font-medium text-violet-300 underline underline-offset-4"
                    >
                      Try again
                    </button>
                  </div>
                ) : members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-9">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                      <Users size={21} className="text-violet-300" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-white/75">
                      No collaborators yet
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      Invite someone to work on this canvas.
                    </p>
                  </div>
                ) : (
                  <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {members.map((member) => {
                      const isOwner = member.role === "owner";
                      const memberName = isOwner
                        ? currentProfile?.name || member.name || member.user?.name
                        : member.name || member.user?.name;
                      const displayName =
                        memberName?.trim() ||
                        member.email
                          ?.split("@")[0]
                          .replace(/[._-]+/g, " ")
                          .replace(/\b\w/g, (letter) => letter.toUpperCase()) ||
                        "User";
                      const avatar = isOwner
                        ? currentProfile?.avatar ||
                          currentProfile?.avatarUrl ||
                          currentProfile?.imageUrl ||
                          member.avatar ||
                          member.avatarUrl ||
                          member.imageUrl ||
                          member.user?.avatar ||
                          member.user?.avatarUrl ||
                          member.user?.imageUrl
                        : member.avatar ||
                          member.avatarUrl ||
                          member.imageUrl ||
                          member.user?.avatar ||
                          member.user?.avatarUrl ||
                          member.user?.imageUrl;

                      return (
                        <li
                          key={member.userId}
                          className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition-all duration-200 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                        >
                          {/* Avatar */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-xs font-bold text-violet-200">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={`${displayName} avatar`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(displayName) || "U"
                            )}
                          </div>

                          {/* Member details */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-white/90">
                              {displayName}
                              {isOwner ? " (You)" : ""}
                            </p>
                            <p className="mt-1 text-[10px] text-white/35">
                              {member.email || member.userId}
                            </p>
                          </div>

                          {/* Role */}
                          {isOwner ? (
                            <span className="flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-2.5 py-2 text-[10px] font-semibold text-amber-300">
                              <Crown size={12} />
                              Owner
                            </span>
                          ) : (
                            <>
                              <div className="relative">
                                <select
                                  value={member.role}
                                  onChange={(event) =>
                                    void handleRoleChange(
                                      member.userId,
                                      event.target.value
                                    )
                                  }
                                  disabled={isPending}
                                  aria-label={`Role for ${member.email || member.userId}`}
                                  className="h-9 max-w-[125px] appearance-none rounded-lg border border-white/10 bg-[#0b0a17] pl-2 pr-5 text-[10px] font-medium text-white/75 outline-none transition hover:border-violet-400/30 focus:border-violet-400/50 disabled:opacity-40"
                                >
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleRemove(
                                    member.userId,
                                    member.email || member.userId
                                  )
                                }
                                disabled={isPending}
                                aria-label={`Remove ${member.email || member.userId}`}
                                title="Remove member"
                                className="rounded-lg border border-transparent p-2 text-white/30 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                <Shield size={13} className="text-emerald-400" />
                <p className="text-[10px] text-white/35">
                  Only people you invite can access this canvas.
                </p>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400/80">
                  <Check size={12} />
                  Secure sharing
                </div>
              </div>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
