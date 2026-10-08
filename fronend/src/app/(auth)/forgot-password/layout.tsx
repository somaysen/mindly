import type { ReactNode } from "react";
import AuthLayout from "../authLayout";

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return <AuthLayout imageUrl="">{children}</AuthLayout>;
}
