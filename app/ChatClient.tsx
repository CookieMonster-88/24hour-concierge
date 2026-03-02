"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getHotelFromParams(params: URLSearchParams | null) {
  const raw = params?.get("hotel")?.trim();
  return raw && raw.length > 0 ? raw : "demo";
}

export default function ChatClient() {
  const searchParams = useSearchParams();
  const hotel = useMemo(() => getHotelFromParams(searchParams), [searchParams]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi — I’m your Concierge 24 assistant. Ask me anything about the hotel.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel,
          messages: nextMessages,
        }),
      });

      const data = await res.json().catch(() => ({}));
      const assistantText =
        data?.content || data?.text || data?.message || "Something went wrong.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060607] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4">
            <div className="text-xs tracking-[0.22em] text-white/50">CONCIERGE 24</div>
            <div className="mt-1 text-xl font-semibold">Demo</div>
            <div className="mt-1 text-sm text-white/60">
              Ask about check-in, parking, breakfast, policies, and what’s nearby.
            </div>
          </div>

          <div className="h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white whitespace-pre-wrap"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <div className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your question…"
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/30"
            />
            <button
              onClick={sendMessage}
              disabled={isSending}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-60"
            >
              {isSending ? "Sending…" : "Send"}
            </button>
          </div>

          <div className="mt-3 text-xs text-white/35">
            Demo mode: no key required.
          </div>
        </div>
      </div>
    </div>
  );
}