import React from "react";
import OnboadingLayout from "../onboardingLayout";

const layout = async ({ children }: { children: React.ReactNode }) => {


  return <OnboadingLayout imageUrl="">{children}</OnboadingLayout>;
};

export default layout;
