export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}    
