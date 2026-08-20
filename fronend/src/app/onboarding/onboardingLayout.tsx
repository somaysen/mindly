import React, { Children } from "react";

interface onboardingProps{
    children: React.ReactNode;
    imageUrl:string;
}

const onboardingLayout = ({children, imageUrl} : onboardingProps ) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default onboardingLayout;