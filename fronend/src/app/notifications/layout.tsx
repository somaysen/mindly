import React from "react";

interface NotificationLayoutProps{
    children: React.ReactNode;
}

const NotificationLayout = ({children} : NotificationLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default NotificationLayout;