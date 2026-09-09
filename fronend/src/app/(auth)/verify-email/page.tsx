import { Suspense } from "react";
import Verifyemail from "../.../../../../features/auth/components/verify-email";

function Page() {
  return (
    <Suspense fallback={null}>
      <Verifyemail />
    </Suspense>
  );
}

export default Page;
