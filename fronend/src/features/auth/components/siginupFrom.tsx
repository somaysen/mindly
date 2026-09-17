"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import LoginAnimation from "../../../components/auth/LoginAnimation";
import { FaGoogle } from "react-icons/fa";
import { IoLogoApple } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";

import { useRegister } from "../hooks/useAuthApi";

type SignupFormData = {
  email: string;
  password: string;
};

function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const {
    mutate: registerUser,
    isPending,
  } = useRegister();

  const onSubmit = (data: SignupFormData) => {
    console.log(data);

    setServerError(null);

    const formData = new FormData();

    formData.append("email", data.email.trim().toLowerCase());
    formData.append("password", data.password);

    registerUser(formData, {
      onSuccess: (res) => {
        console.log("Registration successful:", res);

        window.location.href = "/verify-email";
      },

      onError: (error: any) => {
        console.log(error);
        console.error("Registration failed:", error);

        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to create account. Please try again.";

        setServerError(message);
      },
    });
  };

  return (
    <main className="min-h-screen overflow-hidden text-white">
      {/* BACKGROUND */}
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
            grid-cols-1
            px-4 py-4
            lg:grid-cols-[1.02fr_0.98fr]
            lg:px-6 lg:py-6
          "
        >
          {/* LEFT SIDE */}
          <LoginAnimation />

          {/* RIGHT SIDE */}
          <section className="flex items-center justify-center py-4 lg:px-3">
            <div
              className="
                w-full
                max-w-[480px]
                rounded-[20px]
                border border-black/20
                bg-[#191b50]
                px-7 py-7
                shadow-[0_25px_70px_rgba(12,14,55,0.4)]
                sm:px-8
                sm:py-8
              "
            >
              <div className="space-y-5">

                {/* ================= LOGO ================= */}
                <div>
                  <img
                    src="/images/Group 10.png"
                    alt="Mindly"
                    className="h-auto w-[82px]"
                  />
                </div>

                {/* ================= HEADER ================= */}
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
                    Let&apos;s get started.
                  </h2>

                  <p
                    className="
                      max-w-[420px]
                      text-[14px]
                      leading-[1.45]
                      text-white/90
                    "
                  >
                    A quieter place for your thoughts. Create your account
                    and start organizing what matters.
                  </p>
                </div>

                {/* PURPLE DIVIDER */}
                <div className="h-[3px] w-full rounded-full bg-[#3d40a1]" />

                {/* ================= SERVER ERROR ================= */}
                {serverError && (
                  <div
                    className="
                      rounded-lg
                      border border-red-400/20
                      bg-red-500/10
                      px-4 py-3
                      text-sm
                      text-red-200
                    "
                  >
                    {serverError}
                  </div>
                )}

                {/* ================= FORM ================= */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3"
                  noValidate
                >

                  {/* EMAIL */}
                  <div>
                    <div className="relative">

                      <HiOutlineMail
                        size={20}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#6d6f88]
                        "
                      />

                      <input
                        type="email"
                        placeholder="Enter email"
                        autoComplete="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                              "Enter a valid email address",
                          },
                        })}
                        className="
                          h-[43px]
                          w-full
                          rounded-[9px]
                          border
                          border-[#303263]
                          bg-[#171938]
                          pl-11
                          pr-4
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

                    {errors.email && (
                      <p className="mt-1 px-2 text-xs text-red-300">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div className="relative">

                      <LockKeyhole
                        size={19}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#6d6f88]
                        "
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message:
                              "Password must be at least 6 characters",
                          },
                        })}
                        className="
                          h-[43px]
                          w-full
                          rounded-[9px]
                          border
                          border-[#303263]
                          bg-[#171938]
                          pl-11
                          pr-12
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

                      {/* SHOW / HIDE PASSWORD */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="
                          absolute
                          right-4
                          top-1/2
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

                    {errors.password && (
                      <p className="mt-1 px-2 text-xs text-red-300">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* CREATE ACCOUNT */}
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
                      ? "Creating..."
                      : "Create an Account"}
                  </button>
                </form>

                {/* ================= DIVIDER ================= */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#494b70]" />

                  <span
                    className="
                      whitespace-nowrap
                      text-[13px]
                      text-[#85859a]
                    "
                  >
                    Or continue with
                  </span>

                  <div className="h-px flex-1 bg-[#494b70]" />
                </div>

                {/* ================= SOCIAL BUTTONS ================= */}
                <div className="grid grid-cols-3 gap-3">

                  {/* GOOGLE */}
                  <button
                    type="button"
                    className="
                      flex
                      h-[43px]
                      items-center
                      justify-center
                      gap-2

                      rounded-[9px]
                      border
                      border-[#85879e]

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
                      flex
                      h-[43px]
                      items-center
                      justify-center
                      gap-2

                      rounded-[9px]
                      border
                      border-[#85879e]

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
                      flex
                      h-[43px]
                      items-center
                      justify-center
                      gap-2

                      rounded-[9px]
                      border
                      border-[#85879e]

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

                {/* ================= TERMS ================= */}
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
                    By creating an account, you agree to
                    Mindly&apos;s{" "}

                    <Link
                      href="/privacy-policy"
                      className="
                        text-[#8588ff]
                        hover:text-[#a5a7ff]
                      "
                    >
                      Privacy Policy
                    </Link>

                    {" "}and{" "}

                    <Link
                      href="/terms"
                      className="
                        text-[#8588ff]
                        hover:text-[#a5a7ff]
                      "
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>

                  {/* LOGIN */}
                  <p
                    className="
                      text-[13px]
                      text-[#777990]
                    "
                  >
                    Already have an account?{" "}

                    <Link
                      href="/login"
                      className="
                        font-medium
                        text-[#8588ff]
                        transition
                        hover:text-[#a5a7ff]
                      "
                    >
                      Log in
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

export default SignupForm;