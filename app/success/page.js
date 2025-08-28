export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading status…</div>}>
      <SuccessClient />
    </Suspense>
  );
}
