import React from "react";
import AuthLayout from "../authLayout";

const layout = async ({ children }: { children: React.ReactNode }) => {


  return <AuthLayout imageUrl="">{children}</AuthLayout>;
};

export default layout;
