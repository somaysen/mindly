import React from "react";
import MindlyBackground from "@/components/MindlyBackground";

interface OnboardingProps {
  children: React.ReactNode;
  imageUrl: string;
}

const OnboardingLayout = ({
  children,
  imageUrl,
}: OnboardingProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MindlyBackground />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;