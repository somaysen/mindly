import React from "react";

interface WeeklyReflectionLayoutProps{
    children: React.ReactNode;
}

const WeeklyReflectionLayout = ({children} : WeeklyReflectionLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default WeeklyReflectionLayout;