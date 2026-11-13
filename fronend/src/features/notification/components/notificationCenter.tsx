"use client";

import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  Inbox,
  Sparkles,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import type { Notification } from "@/types/notification";

const notificationsQueryKey = ["notifications"];

const getNotificationId = (notification: Notification) =>
  notification.id ?? notification._id;

function formatDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return time;

  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  })} · ${time}`;
}

function getGroup(dateValue?: string) {
  if (!dateValue) return "Earlier";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Earlier";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) return "Today";
  if (date >= yesterday) return "Yesterday";

  return "Earlier";
}

function NotificationCenter() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: api.getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: api.markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: notificationsQueryKey,
      }),
  });

  const notifications = useMemo(
    () =>
      [...(notificationsQuery.data ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      ),
    [notificationsQuery.data],
  );

  const unreadCount = notifications.filter(
    (notification) => notification.read !== true,
  ).length;
  const visibleNotifications = useMemo(
    () =>
      filter === "unread"
        ? notifications.filter((notification) => notification.read !== true)
        : notifications,
    [filter, notifications],
  );

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    visibleNotifications.forEach((notification) => {
      groups[getGroup(notification.createdAt)].push(notification);
    });

    return groups;
  }, [visibleNotifications]);

  return (
    <main className="min-h-full w-full">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#7778ff]/20 bg-[#7778ff]/10">
                  <Bell size={18} className="text-[#999aff]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9291b3]">
                  Your activity
                </span>
              </div>

              <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-[#9291b3]">
                Stay updated with your tasks, reminders and activities.
              </p>
            </div>

            {!notificationsQuery.isPending &&
              !notificationsQuery.isError && (
                <div className="flex items-center gap-3 self-start rounded-2xl border border-[#7778ff]/20 bg-[#7778ff]/[0.07] px-4 py-3 sm:self-auto">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7778ff]/15">
                    <Inbox size={18} className="text-[#a5a6ff]" />
                  </div>

                  <div>
                    <p className="text-xl font-semibold text-white">
                      {unreadCount}
                    </p>
                    <p className="text-[11px] text-[#9291b3]">
                      Unread notifications
                    </p>
                  </div>
                </div>
              )}
          </div>
        </header>

        {/* Content */}
        {notificationsQuery.isPending ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-[#383653] bg-[#191832]/80 p-5"
              >
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-2/3 rounded bg-white/5" />
                    <div className="h-2 w-1/4 rounded bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notificationsQuery.isError ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-400/20 bg-[#21182e] px-6 py-12 text-center"
          >
            <Bell size={28} className="mx-auto text-rose-300" />
            <h2 className="mt-4 font-semibold text-white">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-[#a6a6bd]">
              Unable to load notifications. Please try again.
            </p>
            <button
              type="button"
              onClick={() => notificationsQuery.refetch()}
              className="mt-5 rounded-xl bg-[#7778ff] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6667ed]"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#454363] bg-gradient-to-b from-[#1d1b3a]/80 to-[#15142b]/80 px-5 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#7778ff]/20 bg-[#7778ff]/10">
              <Sparkles size={27} className="text-[#a5a6ff]" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              You're all caught up!
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#9291b3]">
              Nothing new right now. When you receive a reminder or update,
              it will appear here.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#383653] bg-[#191832]/70 p-2">
              <div
                className="flex gap-1"
                role="tablist"
                aria-label="Filter notifications"
              >
                {([
                  { id: "all", label: "All", count: notifications.length },
                  { id: "unread", label: "Unread", count: unreadCount },
                ] as const).map((tab) => {
                  const isSelected = filter === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setFilter(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        isSelected
                          ? "bg-[#7778ff]/15 text-white shadow-sm"
                          : "text-[#9291b3] hover:bg-white/[0.04] hover:text-[#e5e4f5]"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          isSelected
                            ? "bg-[#7778ff]/20 text-[#c8c8ff]"
                            : "bg-white/[0.05] text-[#9291b3]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="px-3 text-xs text-[#777694]">
                {filter === "unread"
                  ? "Showing unread updates"
                  : "Most recent updates first"}
              </p>
            </div>

            {visibleNotifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#454363] bg-gradient-to-b from-[#1d1b3a]/80 to-[#15142b]/80 px-5 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#7778ff]/20 bg-[#7778ff]/10">
                  {filter === "unread" ? (
                    <CheckCheck size={24} className="text-[#a5a6ff]" />
                  ) : (
                    <Sparkles size={24} className="text-[#a5a6ff]" />
                  )}
                </div>
                <h2 className="mt-4 text-base font-semibold text-white">
                  {filter === "unread"
                    ? "You're all caught up"
                    : "No notifications yet"}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#9291b3]">
                  {filter === "unread"
                    ? "There are no unread updates. You can find everything in the All tab."
                    : "When you receive a reminder or update, it will appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-8">

            {/* Notification groups */}
            {Object.entries(groupedNotifications).map(
              ([group, items]) => {
                if (items.length === 0) return null;

                return (
                  <section key={group}>
                    <div className="mb-4 flex items-center gap-3">
                      <h2 className="text-sm font-semibold text-[#d9d8ef]">
                        {group}
                      </h2>
                      <div className="h-px flex-1 bg-[#383653]" />
                      <span className="text-xs text-[#777694]">
                        {items.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {items.map((notification, index) => {
                        const id = getNotificationId(notification);
                        const isRead = notification.read === true;
                        const isUpdating =
                          markReadMutation.isPending &&
                          markReadMutation.variables === id;

                        return (
                          <article
                            key={
                              id ??
                              `${notification.createdAt ?? "notification"}-${index}`
                            }
                            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                              isRead
                                ? "border-[#383653] bg-[#191832]/70 hover:border-[#555373] hover:bg-[#1d1b3b]"
                                : "border-[#7778ff]/30 bg-gradient-to-r from-[#7778ff]/[0.09] to-[#191832]/90 hover:border-[#8586ff]/60"
                            }`}
                          >
                            {!isRead && (
                              <div className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-[#8586ff]" />
                            )}

                            <div className="flex items-start gap-4">
                              {/* Icon */}
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                                  isRead
                                    ? "border-[#454363] bg-[#25233f] text-[#9291b3]"
                                    : "border-[#7778ff]/25 bg-[#7778ff]/15 text-[#a5a6ff]"
                                }`}
                              >
                                <Bell size={19} />
                              </div>

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className={`text-sm font-semibold sm:text-[15px] ${
                                      isRead
                                        ? "text-[#c4c3dc]"
                                        : "text-white"
                                    }`}
                                  >
                                    {notification.title || "Notification"}
                                  </h3>

                                  {!isRead && (
                                    <span className="rounded-full border border-[#7778ff]/25 bg-[#7778ff]/10 px-2 py-0.5 text-[10px] font-semibold text-[#aaaaff]">
                                      NEW
                                    </span>
                                  )}
                                  {notification.type && (
                                    <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] capitalize text-[#9291b3]">
                                      {notification.type.replace(/[_-]/g, " ")}
                                    </span>
                                  )}
                                </div>

                                {notification.message && (
                                  <p className="mt-2 text-[13px] leading-6 text-[#a6a6bd]">
                                    {notification.message}
                                  </p>
                                )}

                                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#777694]">
                                  <Clock3 size={13} />
                                  {formatDate(notification.createdAt)}
                                </div>
                              </div>

                              {/* Mark as read */}
                              {!isRead && id && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    markReadMutation.mutate(id)
                                  }
                                  disabled={markReadMutation.isPending}
                                  aria-label={`Mark ${notification.title || "notification"} as read`}
                                  title="Mark as read"
                                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#7778ff]/25 bg-[#7778ff]/10 px-3 py-2 text-xs font-medium text-[#b0b1ff] transition hover:border-[#8586ff] hover:bg-[#7778ff]/20 hover:text-white disabled:cursor-wait disabled:opacity-50"
                                >
                                  {isUpdating ? (
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#aaaaff] border-t-transparent" />
                                  ) : (
                                    <>
                                      <Check size={14} />
                                      <span className="hidden sm:inline">
                                        Mark read
                                      </span>
                                    </>
                                  )}
                                </button>
                              )}

                              {isRead && (
                                <div
                                  className="flex shrink-0 items-center gap-1.5 text-xs text-[#777694]"
                                  title="Already read"
                                >
                                  <CheckCheck size={16} />
                                  <span className="hidden sm:inline">
                                    Read
                                  </span>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              },
            )}

            {/* Mutation error */}
            {markReadMutation.isError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-200"
              >
                Unable to mark notification as read. Please try again.
              </div>
            )}
          </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default NotificationCenter;
