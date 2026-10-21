import React from "react";

interface NotepadLayoutProps{
    children: React.ReactNode;
}

const NotepadLayout = ({children} : NotepadLayoutProps ) => {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0d0c20]" >
            {children}
        </div>
    )
}

export default NotepadLayout;