"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import LoginAnimation from "../../../components/auth/LoginAnimation";
import { IoLogoApple } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/useAuthApi";
import { getSafeRedirectPath, persistAuthToken } from "@/lib/auth";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { toast } from "react-toastify";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null
    ? (value as UnknownRecord)
    : {};
}

function firstDefined(...values: unknown[]): unknown {
  return values.find((value) => value !== undefined && value !== null);
}

function getLoginErrorMessage(error: unknown): string {
  const root = asRecord(error);
  const response = asRecord(root.response);
  const data = asRecord(response.data);
  const nestedData = asRecord(data.data);

  const message = firstDefined(
    data.message,
    data.error,
    nestedData.message,
    nestedData.error,
    root.message,
  );

  return typeof message === "string" && message.trim()
    ? message
    : "Unable to login. Please check your email and password.";
}

function getLoginResponse(response: unknown) {
  const root = asRecord(response);
  const rootData = asRecord(root.data);
  const nestedData = asRecord(rootData.data);

  const user = asRecord(
    firstDefined(
      rootData.user,
      nestedData.user,
      root.user,
    ),
  );

  const tokenValue = firstDefined(
    rootData.accessToken,
    rootData.access_token,
    rootData.token,
    nestedData.accessToken,
    nestedData.access_token,
    nestedData.token,
    root.accessToken,
    root.access_token,
    root.token,
  );

  const verifiedValue = firstDefined(
    user.isEmailVerified,
    user.isVerified,
    user.emailVerified,
    user.verified,
    nestedData.isEmailVerified,
    nestedData.isVerified,
    nestedData.emailVerified,
    nestedData.verified,
    rootData.isEmailVerified,
    rootData.emailVerified,
    rootData.isVerified,
    root.isEmailVerified,
    root.emailVerified,
    root.isVerified,
    root.verified,
  );

  const userId = firstDefined(
    user.id,
    user._id,
    rootData.userId,
    nestedData.userId,
    root.userId,
  );

  return {
    token: typeof tokenValue === "string" ? tokenValue : null,
    isVerified: verifiedValue,
    userId: typeof userId === "string" ? userId : null,
  };
}

function isEmailVerificationError(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("email") &&
    (
      normalized.includes("not verified") ||
      normalized.includes("verify your email") ||
      normalized.includes("verification required") ||
      normalized.includes("unverified")
    )
  );
}

function SigninForm() {
  const router = useRouter();
  const { mutate: loginUser, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setServerError("");
  };

  const redirectToEmailVerification = (email: string, userId?: string | null) => {
    const params = new URLSearchParams({ email });

    if (userId) {
      params.set("userId", userId);
    }

    router.replace(`/verify-email?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending) return;

    setServerError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      const message = "Email and password are required.";
      setServerError(message);
      toast.error(message);
      return;
    }

    loginUser(
      { email, password },
      {
        onSuccess: (response: unknown) => {
          const { token, isVerified, userId } = getLoginResponse(response);

          // Do not create a frontend session unless verification is explicit.
          if (isVerified === false || isVerified === "false" || isVerified === 0) {
            redirectToEmailVerification(email, userId);
            return;
          }

          if (isVerified !== true && isVerified !== "true" && isVerified !== 1) {
            const message =
              "The server did not return a valid email verification status. Please check the login API response.";
            setServerError(message);
            toast.error(message);
            return;
          }

          if (!token || !token.trim()) {
            const message =
              "The login response did not contain an access token. Please check the backend login response.";
            setServerError(message);
            toast.error(message);
            return;
          }

          try {
            persistAuthToken(token);
          } catch {
            const message =
              "Unable to save your login session. Please try again.";
            setServerError(message);
            toast.error(message);
            return;
          }

          toast.success("Welcome back!");

          const redirect = new URLSearchParams(window.location.search).get(
            "redirect",
          );

          router.replace(getSafeRedirectPath(redirect));
        },

        onError: (error: unknown) => {
          const message = getLoginErrorMessage(error);

          if (isEmailVerificationError(message)) {
            const root = asRecord(error);
            const response = asRecord(root.response);
            const data = asRecord(response.data);
            const nestedData = asRecord(data.data);
            const nestedUser = asRecord(nestedData.user);
            const directUser = asRecord(data.user);

            const userId = firstDefined(
              nestedUser.id,
              nestedUser._id,
              directUser.id,
              directUser._id,
              data.userId,
            );

            redirectToEmailVerification(
              email,
              typeof userId === "string" ? userId : null,
            );
            return;
          }

          setServerError(message);
          toast.error(message);
        },
      },
    );
  };

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <div
        className="
          relative min-h-screen
          bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.5),transparent_30%),
          radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.25),transparent_25%),
          radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2),transparent_25%),
          radial-gradient(circle_at_90%_90%,rgba(116,105,255,0.55),transparent_25%),
          linear-gradient(135deg,#6973ff_0%,#5361ff_48%,#5966ff_100%)]
        "
      >
        <div
          className="
            mx-auto grid min-h-screen max-w-[1280px]
            grid-cols-1 px-4 py-4
            lg:grid-cols-[1.02fr_0.98fr]
            lg:px-6 lg:py-6
          "
        >
          {/* LEFT */}
          <LoginAnimation />

          {/* RIGHT */}
          <section className="flex items-center justify-center py-4 lg:px-3">
            <div
              className="
                w-full max-w-[480px]
                rounded-[20px]
                border border-black/20
                bg-[#191b50]
                px-7 py-7
                shadow-[0_25px_70px_rgba(12,14,55,0.4)]
                sm:px-8 sm:py-8
              "
            >
              <div className="space-y-5">
                {/* LOGO */}
                <div>
                  <img
                    src="/images/Group 10.png"
                    alt="Mindly"
                    className="h-auto w-[82px]"
                  />
                </div>

                {/* HEADER */}
                <div className="space-y-2">
                  <h2
                    className="
                      font-[family-name:var(--font-bricolage-grotesque)]
                      text-[24px]
                      font-semibold
                      leading-tight
                      tracking-[-0.02em]
                    "
                  >
                    Let's get started.
                  </h2>

                  <p className="max-w-[420px] text-[14px] leading-[1.45] text-white/90">
                    A quieter place for your thoughts. Sign in to capture,
                    organize, and focus on what matters.
                  </p>
                </div>

                {/* DIVIDER */}
                <div className="h-[3px] w-full rounded-full bg-[#3d40a1]" />

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* EMAIL */}
                  <div className="relative">
                    <HiOutlineMail
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-[#6d6f88]
                      "
                      size={20}
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                      autoComplete="email"
                      className="
                        h-[43px]
                        w-full
                        rounded-[9px]
                        border
                        border-[#303263]
                        bg-[#171938]
                        pl-11 pr-4
                        text-[13px]
                        font-medium
                        text-white
                        outline-none
                        transition
                        placeholder:text-[#66677d]
                        focus:border-[#5559df]
                        focus:ring-1
                        focus:ring-[#5559df]
                      "
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="relative">
                    <LockKeyhole
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-[#6d6f88]
                      "
                      size={19}
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                      autoComplete="current-password"
                      className="
                        h-[43px]
                        w-full
                        rounded-[9px]
                        border
                        border-[#303263]
                        bg-[#171938]
                        pl-11 pr-12
                        text-[13px]
                        font-medium
                        text-white
                        outline-none
                        transition
                        placeholder:text-[#66677d]
                        focus:border-[#5559df]
                        focus:ring-1
                        focus:ring-[#5559df]
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-[#77798f]
                        transition
                        hover:text-white
                      "
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* FORGOT PASSWORD */}
                  <div className="flex justify-end pt-0.5">
                    <Link
                      href="/forgot-password"
                      className="
                        text-[13px]
                        font-medium
                        text-[#8588ff]
                        transition
                        hover:text-[#a5a7ff]
                      "
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* ERROR */}
                  {serverError && (
                    <p
                      role="alert"
                      aria-live="polite"
                      className="text-center text-xs text-red-400"
                    >
                      {serverError}
                    </p>
                  )}

                  {/* LOGIN */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="
                      h-[43px]
                      w-full
                      rounded-full
                      border border-white/10
                      bg-gradient-to-r
                      from-[#5558e8]
                      to-[#5d65f5]
                      text-[13px]
                      font-medium
                      text-white
                      shadow-[0_4px_15px_rgba(82,87,235,0.25)]
                      transition
                      hover:brightness-110
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {isPending ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                {/* SOCIAL */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#494b70]" />

                  <span className="whitespace-nowrap text-[13px] text-[#85859a]">
                    Or continue with
                  </span>

                  <div className="h-px flex-1 bg-[#494b70]" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* GOOGLE */}
                  <GoogleLoginButton />

                  {/* APPLE */}
                  <button
                    type="button"
                    className="
                      flex h-[43px]
                      items-center justify-center
                      gap-2
                      rounded-[9px]
                      border border-[#85879e]
                      bg-transparent
                      text-[14px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/5
                    "
                  >
                    <IoLogoApple className="text-[19px]" />
                    <span>Apple</span>
                  </button>

                  {/* EMAIL */}
                  <button
                    type="button"
                    className="
                      flex h-[43px]
                      items-center justify-center
                      gap-2
                      rounded-[9px]
                      border border-[#85879e]
                      bg-transparent
                      text-[14px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/5
                    "
                  >
                    <HiOutlineMail className="text-[19px]" />
                    <span>Email</span>
                  </button>
                </div>

                {/* TERMS */}
                <div className="space-y-4 pt-1 text-center">
                  <p
                    className="
                      mx-auto
                      max-w-[420px]
                      text-[12px]
                      leading-5
                      text-[#777990]
                    "
                  >
                    By creating an account, you agree to Mindly's{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-[#8588ff] hover:text-[#a5a7ff]"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms"
                      className="text-[#8588ff] hover:text-[#a5a7ff]"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>

                  <p className="text-[13px] text-[#777990]">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="
                        font-medium
                        text-[#8588ff]
                        hover:text-[#a5a7ff]
                      "
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default SigninForm;
