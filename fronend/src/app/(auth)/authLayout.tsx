import React, { Children } from "react";

interface AuthLayoutProps{
    children: React.ReactNode;
    imageUrl:string;
}

const AuthLayout = ({children, imageUrl} : AuthLayoutProps ) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default AuthLayout;