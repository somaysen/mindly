import React from "react";

interface CalendarLayoutProps{
    children: React.ReactNode;
}

const CalendarLayout = ({children} : CalendarLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default CalendarLayout;