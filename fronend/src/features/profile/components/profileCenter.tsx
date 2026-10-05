"use client";

import React, { useState } from "react";
import { Pencil, LogOut, X, AlertTriangle } from "lucide-react";
import ProfileRight from "./profileRight";
import { useProfileInfo, useLogOut } from "../hooks/useProfile";
import { clearAuthCookies } from "@/lib/auth";

function ProfileCenter() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useProfileInfo();

  const logoutMutation = useLogOut();

  const profile = response?.data;

  // Open logout popup
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Cancel logout
  const handleCancelLogout = () => {
    if (logoutMutation.isPending) return;

    setShowLogoutModal(false);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
        clearAuthCookies();
        window.location.replace("/login");
      },

      onError: (error) => {
        console.error("Logout failed:", error);

        setShowLogoutModal(false);

        window.alert(
          "Unable to log out right now. Please try again."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full px-8 py-6 text-white">
        <h1 className="mb-8 text-3xl font-semibold">
          Settings
        </h1>

        <div className="h-[140px] w-full animate-pulse rounded-2xl bg-[#1a1938]" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen w-full px-8 py-6 text-white">
        <h1 className="mb-8 text-3xl font-semibold">
          Settings
        </h1>

        <div className="rounded-2xl bg-[#1a1938] p-6 text-[#8885a8]">
          Unable to load profile information.
        </div>
      </div>
    );
  }

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <>
      <div className="min-h-screen w-full px-8 py-6 text-white">
        {/* Header */}
        <h1 className="mb-8 text-3xl font-semibold">
          Settings
        </h1>

        {/* TWO PARTS */}
        <div className="grid w-full grid-cols-1 items-start gap-8 xl:grid-cols-2">

          {/* LEFT PART */}
          <div className="w-full">

            {/* Profile */}
            <h2 className="mb-3 text-lg text-[#b5b2d0]">
              Profile
            </h2>

            {/* Profile Card */}
            <div className="flex min-h-[140px] w-full items-center justify-between rounded-2xl bg-[#1a1938] p-6">
              <div className="flex items-center gap-5">

                {/* Avatar */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#294c3c] text-3xl">
                  🦌
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-lg font-medium">
                    {profile.name}
                  </h3>

                  <p className="text-sm text-[#8885a8]">
                    {profile.auth?.email}
                  </p>

                  <p className="mt-1 text-sm text-[#8885a8]">
                    Member since {memberSince}
                  </p>
                </div>
              </div>

              {/* Edit */}
              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-full border border-[#34335d] px-5 py-2 text-sm transition hover:bg-[#292751]"
              >
                <Pencil size={15} />
                Edit
              </button>
            </div>

            {/* Stats */}
            <div className="mt-3 grid w-full grid-cols-3 gap-3">

              <div className="rounded-2xl bg-[#1a1938] p-5">
                <h3 className="text-2xl font-semibold">
                  2
                </h3>

                <p className="mt-1 text-sm text-[#777493]">
                  Tasks completed
                </p>
              </div>

              <div className="rounded-2xl bg-[#1a1938] p-5">
                <h3 className="text-2xl font-semibold">
                  1
                </h3>

                <p className="mt-1 text-sm text-[#777493]">
                  Thoughts captured
                </p>
              </div>

              <div className="rounded-2xl bg-[#1a1938] p-5">
                <h3 className="text-2xl font-semibold">
                  0
                </h3>

                <p className="mt-1 text-sm text-[#777493]">
                  Focus sessions
                </p>
              </div>

            </div>

            {/* Account */}
            <div className="mt-8">

              <h2 className="mb-3 text-lg text-[#b5b2d0]">
                Account
              </h2>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogoutClick}
                disabled={logoutMutation.isPending}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-[#ff5d61] px-7 py-3 text-base font-medium transition hover:bg-[#ff4b50] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={17} />

                Log out
              </button>

              <p className="mt-3 max-w-lg text-sm text-[#777493]">
                Your data stays on this device — logging out
                just ends this session.
              </p>

            </div>
          </div>

          {/* RIGHT PART */}
          <div className="w-full">
            <ProfileRight />
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ================================================= */}

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={handleCancelLogout}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-[#302e55] bg-[#15142d] p-7 shadow-2xl"
          >

            {/* Close Button */}
            <button
              type="button"
              onClick={handleCancelLogout}
              disabled={logoutMutation.isPending}
              className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#8581a5] transition hover:bg-[#242241] hover:text-white disabled:cursor-not-allowed"
            >
              <X size={19} />
            </button>

            {/* Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff5d61]/10 text-[#ff5d61]">
              <AlertTriangle size={27} />
            </div>

            {/* Content */}
            <h2
              id="logout-title"
              className="text-xl font-semibold text-white"
            >
              Do you want to log out?
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#8885a8]">
              Are you sure you want to log out of your account?
              You will need to log in again to access your account.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex justify-end gap-3">

              {/* Cancel */}
              <button
                type="button"
                onClick={handleCancelLogout}
                disabled={logoutMutation.isPending}
                className="cursor-pointer rounded-full border border-[#36345b] px-6 py-2.5 text-sm font-medium text-[#b5b2d0] transition hover:bg-[#252344] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={logoutMutation.isPending}
                className="flex min-w-[110px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ff5d61] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff4b50] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={15} />
                    Log out
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileCenter;
