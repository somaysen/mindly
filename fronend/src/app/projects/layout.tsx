import React from "react";

interface projectLayoutProps{
    children: React.ReactNode;
}

const projectLayout = ({children} : projectLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default projectLayout;