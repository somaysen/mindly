
"use client";

import React from "react";
import { Bell, CheckSquare, Focus, Waves } from "lucide-react";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "../hooks/useNotificationSettings";

type ToggleProps = {
  enabled: boolean;
  label: string;
  disabled: boolean;
  onChange: () => void;
};

const Toggle = ({
  enabled,
  label,
  disabled,
  onChange,
}: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex h-7 w-[58px] shrink-0
        items-center rounded-full p-1
        transition-colors duration-300 ease-in-out
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1938]
        disabled:cursor-not-allowed disabled:opacity-50
        ${enabled ? "bg-blue-600" : "bg-[#45445f]"}
      `}
    >
      {/* ON / OFF label */}
      <span
        className={`
          absolute text-[9px] font-bold tracking-wide text-white
          transition-opacity duration-200
          ${enabled ? "left-2 opacity-100" : "right-2 opacity-100"}
        `}
      >
        {enabled ? "ON" : "OFF"}
      </span>

      {/* Sliding circle */}
      <span
        className={`
          absolute left-1 h-5 w-5 rounded-full
          bg-white shadow-md
          transition-transform duration-300 ease-in-out
          ${enabled ? "translate-x-[30px]" : "translate-x-0"}
        `}
      />
    </button>
  );
};

type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

const SettingItem = ({
  icon,
  title,
  description,
  children,
}: SettingItemProps) => {
  return (
    <div className="flex min-h-[82px] items-center justify-between gap-3 rounded-2xl bg-[#1a1938] px-3 py-4 transition-colors hover:bg-[#201f42] sm:gap-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#242348]">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-[15px] font-medium text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-5 text-[#777493]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};

function ProfileRight() {
  const settingsQuery = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const settings = settingsQuery.data;
  const isUpdating = updateSettingsMutation.isPending;

  const toggleSetting = (
    value: boolean,
    label: string,
    onChange: () => void,
  ) => (
    <Toggle
      enabled={value}
      label={label}
      disabled={isUpdating}
      onChange={onChange}
    />
  );

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-medium text-[#b5b2d0]">
          Notifications
        </h2>

        <p className="mt-1 text-sm text-[#777493]">
          Manage how and when you receive notifications.
        </p>
      </div>

      {/* Loading */}
      {settingsQuery.isLoading ? (
        <div
          className="h-[140px] animate-pulse rounded-2xl bg-[#1a1938]"
          aria-label="Loading notification settings"
        />
      ) : settingsQuery.isError || !settings ? (
        /* Error */
        <div className="rounded-2xl bg-[#1a1938] p-4 text-sm text-[#8885a8]">
          <p>
            {getApiErrorMessage(
              settingsQuery.error,
              "Unable to load notification settings.",
            )}
          </p>

          <button
            type="button"
            onClick={() => void settingsQuery.refetch()}
            className="mt-3 text-white underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {/* All Notifications */}
            <SettingItem
              icon={<Bell size={20} className="text-[#aaa7c4]" />}
              title="Notifications"
              description="Enable or disable all notifications"
            >
              {toggleSetting(
                settings.notificationsEnabled,
                "Notifications",
                () =>
                  updateSettingsMutation.mutate({
                    notificationsEnabled: !settings.notificationsEnabled,
                  }),
              )}
            </SettingItem>

            {/* Task Reminders */}
            <SettingItem
              icon={<CheckSquare size={20} className="text-[#aaa7c4]" />}
              title="Task Reminders"
              description="Never miss a deadline"
            >
              {toggleSetting(
                settings.taskReminders,
                "Task Reminders",
                () =>
                  updateSettingsMutation.mutate({
                    taskReminders: !settings.taskReminders,
                  }),
              )}
            </SettingItem>

            {/* Focus Sessions */}
            <SettingItem
              icon={<Focus size={20} className="text-[#aaa7c4]" />}
              title="Focus Sessions"
              description="Notifications for your focus sessions"
            >
              {toggleSetting(
                settings.focusSessions,
                "Focus Sessions",
                () =>
                  updateSettingsMutation.mutate({
                    focusSessions: !settings.focusSessions,
                  }),
              )}
            </SettingItem>

            {/* Weekly Reflections */}
            <SettingItem
              icon={<Waves size={21} className="text-[#aaa7c4]" />}
              title="Weekly Reflections"
              description="Review your progress"
            >
              {toggleSetting(
                settings.weeklyReflections,
                "Weekly Reflections",
                () =>
                  updateSettingsMutation.mutate({
                    weeklyReflections: !settings.weeklyReflections,
                  }),
              )}
            </SettingItem>
          </div>

          {/* Update Error */}
          {updateSettingsMutation.isError && (
            <p
              role="alert"
              className="mt-3 text-sm text-[#ff8588]"
            >
              {getApiErrorMessage(
                updateSettingsMutation.error,
                "Unable to save notification settings. Please try again.",
              )}
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default ProfileRight;
