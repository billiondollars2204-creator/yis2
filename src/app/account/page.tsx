import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "./AccountView";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="container" style={{ minHeight: "50vh" }} aria-busy="true" />}>
      <AccountView />
    </Suspense>
  );
}
