"use client";

import { useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/config/axios";
import { persistAuthToken } from "@/lib/auth";

type GoogleAuthResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  data?: GoogleAuthResponse;
};

export default function GoogleLoginButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const requestInProgress = useRef(false);

  const handleSuccess = async (googleResponse: CredentialResponse) => {
    const credential = googleResponse.credential;
    if (!credential || requestInProgress.current) {
      if (!credential) toast.error("Google did not return a sign-in credential.");
      return;
    }

    requestInProgress.current = true;
    setIsPending(true);

    try {
      const response = await api.post<GoogleAuthResponse>("/api/auth/google", {
        credential,
      });
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

      // Some backends return a token in JSON; others set an HttpOnly cookie.
      if (token) persistAuthToken(token);

      toast.success("Signed in with Google.");
      router.replace("/onboarding/username");
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
      className={`flex h-[43px] w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#85879e] bg-transparent ${
        isPending ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <GoogleLogin
        onSuccess={(response) => void handleSuccess(response)}
        onError={() => toast.error("Google sign in was cancelled or could not start.")}
        text="continue_with"
        shape="rectangular"
        theme="filled_black"
        size="large"
        width="128"
      />
    </div>
  );
}
