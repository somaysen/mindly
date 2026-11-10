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

  const app = (
    <>
      <QueryProvider>{children}</QueryProvider>
      <ToastProvider />
    </>
  );

  return clientId ? (
    <GoogleOAuthProvider clientId={clientId}>{app}</GoogleOAuthProvider>
  ) : (
    app
  );
}
