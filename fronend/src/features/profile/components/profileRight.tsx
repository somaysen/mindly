"use client";

import React from "react";
import {
  Bell,
  ChevronRight,
  CheckSquare,
  Sun,
  Waves,
  Focus,
} from "lucide-react";

type ToggleProps = {
  enabled: boolean;
};

const Toggle = ({ enabled }: ToggleProps) => {
  return (
    <div
      className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${
        enabled ? "bg-[#5555e9]" : "bg-[#34344f]"
      }`}
    >
      <div
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
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
    <div className="flex min-h-[82px] items-center justify-between gap-4 rounded-2xl bg-[#1a1938] px-5 py-4 transition-colors hover:bg-[#201f42]">
      <div className="flex min-w-0 items-center gap-5">
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
  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-lg font-medium text-[#b5b2d0]">
          Notifications
        </h2>

        <p className="mt-1 text-sm text-[#777493]">
          Manage how and when you receive notifications.
        </p>
      </div>

      {/* Settings */}
      <div className="space-y-2">
        {/* View Notifications */}
        <SettingItem
          icon={<Bell size={20} className="text-[#aaa7c4]" />}
          title="View notifications"
          description="Reminders from your tasks, events and thoughts"
        >
          <button
            type="button"
            className="flex shrink-0 items-center justify-center rounded-lg p-2 transition-colors hover:bg-[#29274b]"
          >
            <ChevronRight
              size={19}
              className="text-[#777493]"
            />
          </button>
        </SettingItem>

        {/* Task Reminders */}
        <SettingItem
          icon={<CheckSquare size={20} className="text-[#aaa7c4]" />}
          title="Task Reminders"
          description="Never miss a deadline"
        >
          <Toggle enabled={true} />
        </SettingItem>

        {/* Daily Summary */}
        <SettingItem
          icon={<Sun size={21} className="text-[#aaa7c4]" />}
          title="Daily Summary"
          description="A morning look at your day"
        >
          <Toggle enabled={true} />
        </SettingItem>

        {/* Weekly Reflections */}
        <SettingItem
          icon={<Waves size={21} className="text-[#aaa7c4]" />}
          title="Weekly Reflections"
          description="Review your progress"
        >
          <Toggle enabled={false} />
        </SettingItem>

        {/* Focus Session Nudges */}
        <SettingItem
          icon={<Focus size={21} className="text-[#aaa7c4]" />}
          title="Focus Session Nudges"
          description="Gentle check-ins during Calm Mode"
        >
          <Toggle enabled={false} />
        </SettingItem>
      </div>
    </section>
  );
}

export default ProfileRight;
