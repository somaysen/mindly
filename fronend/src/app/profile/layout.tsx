import React from "react";

interface profileLayoutProps{
    children: React.ReactNode;
}

const profileLayout = ({children} : profileLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default profileLayout;