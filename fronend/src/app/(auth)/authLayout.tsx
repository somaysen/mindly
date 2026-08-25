import React, { Children } from "react";
import MindlyBackground from "@/components/MindlyBackground";


interface AuthLayoutProps{
    children: React.ReactNode;
    imageUrl:string;
}

const AuthLayout = ({children, imageUrl} : AuthLayoutProps ) => {
    return (
       <div className="relative min-h-screen overflow-hidden">
             <MindlyBackground />
       
             <div className="relative z-10">
               {children}
             </div>
           </div>
    )
}

export default AuthLayout;