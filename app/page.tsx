import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen p-6">Loading…</div>}>
      <ChatClient />
    </Suspense>
  );
}