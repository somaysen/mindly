import React from "react";

interface BrainLayoutProps{
    children: React.ReactNode;
}

const BrainLayout = ({children} : BrainLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c1f]" >
            {children}
        </div>
    )
}

export default BrainLayout;
