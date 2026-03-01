import { Suspense } from "react";
import ChatClient from "../ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060607]" />}>
      <ChatClient />
    </Suspense>
  );
}