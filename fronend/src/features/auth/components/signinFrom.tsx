"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import LoginAnimation from "../../../components/auth/LoginAnimation";
import { FaGoogle } from "react-icons/fa";
import { IoLogoApple } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/useAuthApi";
import { persistAuthToken, startGoogleOAuth } from "@/lib/auth";
import { toast } from "react-toastify";

function SigninForm() {
  const router = useRouter();
  const {
    mutate: loginUser,
    isPending,
    isError,
    error,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setServerError("");
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setServerError("");

    const email = formData.email.trim().toLowerCase();

    const data = new FormData();

    data.append("email", email);
    data.append("password", formData.password);

    loginUser(data, {
      onSuccess: (res: any) => {
        console.log("========== LOGIN RESPONSE ==========");
        console.log(JSON.stringify(res, null, 2));

        /*
         * Get user from all possible response structures
         */
        const user =
          res?.data?.user ??
          res?.data?.data?.user ??
          res?.user ??
          res?.data?.data ??
          null;

        /*
         * Get token
         */
        const token =
          res?.data?.token ??
          res?.data?.accessToken ??
          res?.data?.data?.token ??
          res?.data?.data?.accessToken ??
          res?.token ??
          res?.accessToken ??
          null;

        /*
         * IMPORTANT
         *
         * Different backends use different names:
         *
         * isVerified
         * isEmailVerified
         * emailVerified
         * verified
         */
        const isVerified =
          user?.isVerified ??
          user?.isEmailVerified ??
          user?.emailVerified ??
          user?.verified ??
          res?.data?.isVerified ??
          res?.data?.isEmailVerified ??
          res?.isVerified ??
          res?.isEmailVerified;

        console.log("USER:", user);
        console.log("TOKEN:", token);
        console.log("IS VERIFIED:", isVerified);

        /*
         * ==================================================
         * EMAIL NOT VERIFIED
         * ==================================================
         *
         * This MUST happen before saving the token.
         */
        if (
          isVerified === false ||
          isVerified === "false" ||
          isVerified === 0
        ) {
          console.log(
            "EMAIL NOT VERIFIED → REDIRECTING TO VERIFY PAGE"
          );

          const verificationParams = new URLSearchParams({ email });
          const userId = user?.id ?? user?._id ?? res?.data?.userId ?? res?.userId;
          if (userId) verificationParams.set("userId", String(userId));
          window.location.href = `/verify-email?${verificationParams.toString()}`;

          return;
        }

        /*
         * ==================================================
         * NO VERIFICATION STATUS
         * ==================================================
         *
         * If backend doesn't send verification status,
         * don't blindly allow login.
         */
        if (
          isVerified === undefined ||
          isVerified === null
        ) {
          console.error(
            "Backend did not return email verification status"
          );

          setServerError(
            "Email verification status was not received from the server."
          );
          toast.error("Email verification status was not received from the server.");

          return;
        }

        /*
         * ==================================================
         * EMAIL VERIFIED
         * ==================================================
         */
        if (isVerified === true || isVerified === "true") {
          if (!token) {
            setServerError(
              "Login successful but authentication token is missing."
            );
            toast.error("Login successful but authentication token is missing.");

            return;
          }

          /*
           * Save token ONLY after email is verified
           */
          persistAuthToken(token);

          console.log(
            "EMAIL VERIFIED → LOGIN SUCCESS"
          );
          toast.success("Welcome back!");
          router.push("/");

          return;
        }

        /*
         * Fallback
         */
        setServerError(
          "Unable to verify your email. Please try again."
        );
        toast.error("Unable to verify your email. Please try again.");
      },

      onError: (err: any) => {
        console.error(
          "========== LOGIN ERROR =========="
        );

        console.error(err);

        /*
         * Get backend error message
         */
        const message =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "";

        /*
         * If backend itself says email is not verified,
         * send user to verification page.
         */
        const lowerMessage =
          String(message).toLowerCase();

        if (
          lowerMessage.includes("email") &&
          (
            lowerMessage.includes("not verified") ||
            lowerMessage.includes("verify your email") ||
            lowerMessage.includes("verification required") ||
            lowerMessage.includes("unverified")
          )
        ) {
          const verificationParams = new URLSearchParams({ email });
          const userId =
            err?.response?.data?.data?.user?.id ??
            err?.response?.data?.user?.id ??
            err?.response?.data?.userId;
          if (userId) verificationParams.set("userId", String(userId));
          window.location.href = `/verify-email?${verificationParams.toString()}`;

          return;
        }

        setServerError(
          message ||
            "Unable to login. Please check your email and password."
        );
        toast.error(
          message || "Unable to login. Please check your email and password."
        );
      },
    });
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
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
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
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
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
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-[#77798f]
                        transition
                        hover:text-white
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
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
                  {(isError || serverError) && (
                    <p className="text-center text-xs text-red-400">
                      {serverError ||
                        (error instanceof Error
                          ? error.message
                          : "Unable to login. Please try again.")}
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
                    {isPending
                      ? "Signing in..."
                      : "Sign In"}
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
                  <button
                    type="button"
                    onClick={startGoogleOAuth}
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
                    <FaGoogle className="text-[17px]" />
                    <span>Google</span>
                  </button>

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
