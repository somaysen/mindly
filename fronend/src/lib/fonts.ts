import localFont from "next/font/local";

export const bricolageGrotesque = localFont({
  src: [
    {
      path: "../../public/fonts/BRICOLAGEGROTESQUE_36PT_SEMICONDENSED-REGULAR.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});
