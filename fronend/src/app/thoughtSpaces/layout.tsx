import React from "react";

interface thoughtSpacesLayoutProps {
  children: React.ReactNode;
}

const thoughtSpacesLayout = ({ children }: thoughtSpacesLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]">
      {children}
    </div>
  );
};

export default thoughtSpacesLayout;
