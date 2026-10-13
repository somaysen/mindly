import React from "react";

interface projectDetailsLayoutProps{
    children: React.ReactNode;
}

const projectDetailsLayout = ({children} : projectDetailsLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default projectDetailsLayout;