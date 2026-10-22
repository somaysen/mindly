"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import QueryProvider from "@/config/tanstack/QueryProvider";
import ToastProvider from "@/components/ToastProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Google Client ID is missing. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryProvider>{children}</QueryProvider>
      <ToastProvider />
    </GoogleOAuthProvider>
  );
}
