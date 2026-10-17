"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "@phosphor-icons/react";
import { useProfileInfo } from "@/features/profile/hooks/useProfile";
import { useUserInfo } from "@/features/onboarding/hooks/userOnbordingApi";

interface ProfileModalProps {
  avatars: string[];
}

export default function ProfileModal({
  avatars,
}: ProfileModalProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0] ?? "");
  const [displayName, setDisplayName] = useState("");
  const [saveError, setSaveError] = useState("");
  const queryClient = useQueryClient();
  const { data: response } = useProfileInfo();
  const profile = response?.data;
  const profileAvatar = [profile?.avatar, profile?.avatarUrl, ...avatars].find(
    (avatar): avatar is string =>
      typeof avatar === "string" && avatar.trim().length > 0
  );
  const saveProfile = useUserInfo();

  useEffect(() => {
    if (!showProfile) return;

    const savedAvatar = profile?.avatar ?? profile?.avatarUrl;
    setSelectedAvatar(
      typeof savedAvatar === "string" && savedAvatar.trim()
        ? savedAvatar.trim()
        : (avatars.find((avatar) => avatar.trim()) ?? "")
    );
    setDisplayName(profile?.name ?? "");
    setSaveError("");
  }, [showProfile, profile, avatars]);

  const handleSave = () => {
    setSaveError("");
    saveProfile.mutate(
      {
        avatar: selectedAvatar,
        ...(displayName.trim() ? { name: displayName.trim() } : {}),
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
          setShowProfile(false);
        },
        onError: () => {
          setSaveError("Could not save your profile. Please try again.");
        },
      }
    );
  };

  return (
    <>
      {/* Profile Button */}
      <button
        type="button"
        aria-label="Profile"
        onClick={() => setShowProfile(true)}
        className="
          h-[22px]
          w-[22px]
          cursor-pointer
          overflow-hidden
          rounded-full
          bg-[#dfe1f7]
          shadow-[0_0_0_3px_rgba(255,255,255,0.10)]
          transition-transform
          hover:scale-110
        "
      >
        {profileAvatar && (
          <img
            src={profileAvatar}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        )}
      </button>

      {/* Profile Modal */}
      {showProfile && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-[2px]
          "
          onClick={() => setShowProfile(false)}
        >
          <div
            className="
              relative
              w-[385px]
              rounded-[26px]
              border
              border-white/10
              bg-[#1d1e55]
              p-7
              text-white
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowProfile(false)}
              className="
                absolute
                right-5
                top-5
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-[#aaaed0]
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h2 className="mb-5 text-sm font-medium text-white">
              Choose your avatar
            </h2>

            <div className="flex gap-5">
              {/* Left Section */}
              <div className="w-[175px]">
                {/* Avatar Selection */}
                <div className="grid grid-cols-4 gap-3">
                  {avatars
                    .filter((avatar) => avatar.trim())
                    .map((avatar, index) => (
                    <button
                      key={`${avatar}-${index}`}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`
                        h-[36px]
                        w-[36px]
                        overflow-hidden
                        rounded-full
                        transition-all
                        ${
                          selectedAvatar === avatar
                            ? "ring-2 ring-[#7b82ff] ring-offset-2 ring-offset-[#1d1e55]"
                            : "hover:scale-110"
                        }
                      `}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                    ))}
                </div>

                {/* Display Name */}
                <label className="mt-5 block text-xs text-white">
                  Display name
                </label>

                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="
                    mt-2
                    h-[42px]
                    w-full
                    rounded-[9px]
                    border
                    border-[#38396f]
                    bg-[#181944]
                    px-3
                    text-sm
                    text-white
                    outline-none
                    transition
                    focus:border-[#6972ef]
                  "
                />
              </div>

              {/* Avatar Preview */}
              <div
                className="
                  flex
                  h-[176px]
                  w-[138px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-white/5
                  bg-[#24255d]
                "
              >
                <div
                  className="
                    h-[108px]
                    w-[108px]
                    overflow-hidden
                    rounded-full
                    bg-[#42c8bb]
                  "
                >
                  {selectedAvatar && (
                    <img
                      src={selectedAvatar}
                      alt="Selected avatar"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <p className="mt-3 text-sm font-medium text-white">
                  {displayName || "Your name"}
                </p>
              </div>
            </div>

            {saveError && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                {saveError}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="
                  h-[38px]
                  rounded-full
                  border
                  border-[#6d72c8]
                  px-5
                  text-sm
                  text-white
                  transition
                  hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saveProfile.isPending || !selectedAvatar}
                className="
                  h-[38px]
                  rounded-full
                  bg-[#636df1]
                  px-5
                  text-sm
                  font-medium
                  text-white
                  shadow-[0_8px_20px_rgba(99,109,241,0.25)]
                  transition
                  hover:bg-[#727bf5]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saveProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
