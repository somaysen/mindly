
  "use client";

  import { useState } from "react";
  import { useForm } from "react-hook-form";
  import { Eye, EyeOff } from "lucide-react";
  import LoginAnimation from "../../../components/auth/LoginAnimation";
  import { FaGoogle } from "react-icons/fa";
  import { IoLogoApple } from "react-icons/io5";
  import { HiOutlineMail } from "react-icons/hi";
  import Link from "next/link";

  // Change this import path if your hook is stored somewhere else.
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
      console.log(data)
      setServerError(null);
      
      const formData = new FormData();

      formData.append("email", data.email.trim());
      formData.append("password", data.password);
      
      registerUser(formData, {
        onSuccess: (res) => {
          console.log("Registration successful:", res);
          
          // If your backend returns a token and you need to store it:
          // localStorage.setItem("token", res.data.token);

          // Redirect after successful registration.
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
        <div
          className="
            relative min-h-screen
            bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.55),transparent_30%),
            radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.3),transparent_25%),
            radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.28),transparent_25%),
            radial-gradient(circle_at_90%_90%,rgba(116,105,255,0.6),transparent_25%),
            linear-gradient(135deg,#6973ff_0%,#5361ff_48%,#5966ff_100%)]
          "
        >
          <div className="mx-auto grid min-h-screen max-w-[1200px] grid-cols-1 px-4 py-4 lg:grid-cols-[1.02fr_0.98fr] lg:px-6 lg:py-6">
            {/* LEFT SIDE */}
            <LoginAnimation />

            {/* RIGHT SIDE */}
            <section className="flex items-center justify-center py-4 lg:px-3">
              <div
                className="
                  w-full
                  max-w-[450px]
                  rounded-[1.75rem]
                  bg-[#1d2057]
                  px-3
                  py-5
                  shadow-[0_28px_80px_rgba(16,18,59,0.35)]
                  md:px-7
                  md:py-6
                  lg:min-h-[650px]
                "
              >
                <div className="space-y-5">
                  {/* HEADER */}
                  <div className="space-y-3">
                    {/* LOGO */}
                    <div className="text-[1rem] font-semibold leading-none tracking-[-0.02em] text-[#aaaaff]">
                      <img
                        src="/images/Group 10.png"
                        alt="Mindly Logo"
                      />
                    </div>

                    {/* TITLE + DESCRIPTION */}
                    <div className="space-y-2">
                      <h2
                        className="
                          font-[family-name:var(--font-bricolage-grotesque)]
                          text-[1rem]
                          font-semibold
                          md:text-[1.5rem]
                        "
                      >
                        Let&apos;s get started.
                      </h2>

                      <p
                        className="
                          max-w-[440px]
                          text-[0.80rem]
                          leading-6
                          text-white/95
                          md:text-[0.98rem]
                        "
                      >
                        A quieter place for your thoughts. Sign in to capture,
                        organize, and focus on what matters.
                      </p>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-[2px] w-full rounded-full bg-[#4144a7]" />
                  </div>

                  {/* SERVER ERROR */}
                  {serverError && (
                    <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {serverError}
                    </div>
                  )}

                  {/* FORM */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                  >
                    {/* EMAIL */}
                    <div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        autoComplete="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                        className="
                          h-11
                          w-full
                          rounded-[0.9rem]
                          border-none
                          bg-[#d9d9df]
                          px-4
                          text-[0.95rem]
                          font-medium
                          text-[#2e3156]
                          outline-none
                          placeholder:text-[#7b7c87]
                          focus:ring-2
                          focus:ring-[#676cff]
                          md:h-12
                        "
                      />

                      {errors.email && (
                        <p className="mt-1 px-2 text-xs text-red-300">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                      <div className="relative">
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
                            h-11
                            w-full
                            rounded-[0.9rem]
                            border-none
                            bg-[#d9d9df]
                            px-4
                            pr-12
                            text-[0.95rem]
                            font-medium
                            text-[#2e3156]
                            outline-none
                            placeholder:text-[#7b7c87]
                            focus:ring-2
                            focus:ring-[#676cff]
                            md:h-12
                          "
                        />

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
                            text-[#85858d]
                            transition
                            hover:text-[#5d65f7]
                          "
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} strokeWidth={2.5} />
                          ) : (
                            <Eye size={18} strokeWidth={2.5} />
                          )}
                        </button>
                      </div>

                      {errors.password && (
                        <p className="mt-1 px-2 text-xs text-red-300">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* CREATE ACCOUNT BUTTON */}
                    <button
                      type="submit"
                      disabled={isPending}

                      className="
                        h-11
                        w-full
                        rounded-full
                        bg-gradient-to-r
                        from-[#585be7]
                        to-[#5d65f7]
                        text-lg
                        font-mono
                        text-white
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]
                        transition
                        hover:brightness-110
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        md:h-11
                      "
                    >
                      {isPending
                        ? "Creating..."
                        : "Create an Account"}
                    </button>
                  </form>

                  {/* DIVIDER */}
                  <div className="flex items-center gap-4 text-[#7d7c8f]">
                    <div className="h-px flex-1 bg-[#595a73]" />

                    <span className="whitespace-nowrap text-sm font-medium">
                      Or continue with
                    </span>

                    <div className="h-px flex-1 bg-[#595a73]" />
                  </div>

                  {/* SOCIAL BUTTONS */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {/* GOOGLE */}
                    <button
                      type="button"
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        bg-white
                        px-4
                        text-[0.95rem]
                        font-semibold
                        text-[#4d5063]
                        transition
                        hover:bg-gray-100
                      "
                    >
                      <span className="text-xl font-bold text-[#f11818]">
                        <FaGoogle />
                      </span>
                      Google
                    </button>

                    {/* APPLE */}
                    <button
                      type="button"
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        gap-2.5
                        rounded-xl
                        bg-white
                        px-4
                        text-[0.95rem]
                        font-semibold
                        text-[#4d5063]
                        transition
                        hover:bg-gray-100
                      "
                    >
                      <span className="text-2xl">
                        <IoLogoApple />
                      </span>
                      Apple
                    </button>

                    {/* EMAIL */}
                    <button
                      type="button"
                      className="
                        flex
                        h-11
                        items-center
                        justify-center
                        gap-2.5
                        rounded-xl
                        bg-white
                        px-4
                        text-[0.95rem]
                        font-semibold
                        text-[#4d5063]
                        transition
                        hover:bg-gray-100
                      "
                    >
                      <span className="text-2xl">
                        <HiOutlineMail />
                      </span>
                      Email
                    </button>
                  </div>

                  {/* TERMS */}
                  <div className="space-y-5 pt-1 text-center">
                    <p
                      className="
                        mx-auto
                        max-w-[430px]
                        text-[0.80rem]
                        leading-6
                        text-[#7e7d97]
                      "
                    >
                      By creating an account, you agree to Mindly&apos;s{" "}
                      <br />

                      <a
                        href="#"
                        className="text-[#8588ff] hover:text-[#a3a5ff]"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}

                      <a
                        href="#"
                        className="text-[#8588ff] hover:text-[#a3a5ff]"
                      >
                        Terms of Service
                      </a>
                      .
                    </p>

                    <p className="text-[0.95rem] text-[#7e7d97]">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="
                          font-medium
                          text-[#8588ff]
                          hover:text-[#a3a5ff]
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

