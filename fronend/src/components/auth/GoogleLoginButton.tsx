"use client";

import { useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import api from "@/config/axios";
import { getSafeRedirectPath, persistAuthToken } from "@/lib/auth";

type GoogleAuthUser = {
  id?: string | number;
  _id?: string | number;
  userId?: string | number;
};

type GoogleAuthResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  id?: string | number;
  _id?: string | number;
  userId?: string | number;
  user?: GoogleAuthUser;
  data?: GoogleAuthResponse;
};

export default function GoogleLoginButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const requestInProgress = useRef(false);

  const handleSuccess = async (googleResponse: CredentialResponse) => {
    const credential = googleResponse.credential;

    if (!credential || requestInProgress.current) {
      if (!credential) {
        toast.error("Google did not return a sign-in credential.");
      }
      return;
    }

    requestInProgress.current = true;
    setIsPending(true);

    try {
      const response = await api.post<GoogleAuthResponse>(
        "/api/auth/google",
        { credential }
      );

      const result = response.data;

      const token =
        result?.data?.data?.token ??
        result?.data?.data?.accessToken ??
        result?.data?.data?.access_token ??
        result?.data?.token ??
        result?.data?.accessToken ??
        result?.data?.access_token ??
        result?.token ??
        result?.accessToken ??
        result?.access_token;

      const user =
        result?.data?.user ??
        result?.data?.data?.user ??
        result?.user ??
        result?.data?.data;

      const userId =
        user?.id ??
        user?._id ??
        user?.userId ??
        result?.data?.userId ??
        result?.data?.data?.userId ??
        result?.userId ??
        result?.id ??
        result?._id;

      if (token) {
        persistAuthToken(token);
      }

      if (userId === undefined || userId === null || String(userId).trim() === "") {
        router.replace("/onboarding/username");
      } else {
        const requestedPath = new URLSearchParams(
          window.location.search
        ).get("redirect");

        router.replace(getSafeRedirectPath(requestedPath));
      }

      toast.success("Signed in with Google.");
    } catch (error: unknown) {
      const requestError = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };

      toast.error(
        requestError.response?.data?.message ??
          requestError.response?.data?.error ??
          requestError.message ??
          "Google sign in failed. Please try again."
      );
    } finally {
      requestInProgress.current = false;
      setIsPending(false);
    }
  };

  return (
    <div
      aria-busy={isPending}
      className={`relative flex h-[43px] w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#85879e] bg-transparent transition hover:bg-white/5 focus-within:ring-2 focus-within:ring-[#818cf8] focus-within:ring-offset-2 focus-within:ring-offset-[#191b4d] ${
        isPending ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {/* Custom Google icon and label */}
      <span
        aria-hidden="true"
        className="pointer-events-none flex items-center justify-center gap-2 text-[14px] font-semibold text-white"
      >
        <Image
          src="/svg/google-icon-logo-svgrepo-com.svg"
          alt=""
          width={18}
          height={18}
          className="h-[18px] w-[18px] object-contain"
          priority
        />

        <span>Google</span>
      </span>

      {/* Google authentication overlay */}
      <div className="absolute inset-0 z-10 flex justify-start opacity-0">
        <GoogleLogin
          onSuccess={(response) => void handleSuccess(response)}
          onError={() =>
            toast.error("Google sign in was cancelled or could not start.")
          }
          shape="rectangular"
          theme="filled_black"
          size="large"
          width="200"
        />
      </div>
    </div>
  );
}
