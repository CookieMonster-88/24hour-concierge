// app/ChatClient.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function getHotelFromParams(params: URLSearchParams | null) {
  const raw = params?.get("hotel")?.trim();
  // ✅ Default should be demo (public)
  return raw && raw.length > 0 ? raw : "demo";
}

function getHotelKeyFromParams(params: URLSearchParams | null) {
  // ✅ Support both k= and key= (you've used k= in your links)
  const raw = (params?.get("k") || params?.get("key") || "").trim();
  return raw.length > 0 ? raw : "";
}

export default function ChatClient() {
  const searchParams = useSearchParams();

  const hotel = useMemo(() => getHotelFromParams(searchParams), [searchParams]);
  const hotelKey = useMemo(() => getHotelKeyFromParams(searchParams), [searchParams]);

  // Demo should never require a key.
  const requiresKey = hotel !== "demo";
  const isUnauthorized = requiresKey && !hotelKey;

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

    if (isUnauthorized) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unauthorized link. Please ask reception for the official QR code provided by the hotel.",
        },
      ]);
      setInput("");
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(requiresKey && hotelKey ? { "x-hotel-key": hotelKey } : {}),
        },
        body: JSON.stringify({
          hotelId: hotel,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      // ✅ Your API returns { content }, not { text } or { message }
      const assistantText =
        typeof data?.content === "string"
          ? data.content
          : typeof data?.text === "string"
            ? data.text
            : typeof data?.message === "string"
              ? data.message
              : "Something went wrong. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060607] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          <div className="mb-4">
            <div className="text-xs tracking-[0.22em] text-white/50">CONCIERGE 24</div>
            <div className="mt-1 text-xl font-semibold">
              {hotel === "demo" ? "Demo" : hotel.charAt(0).toUpperCase() + hotel.slice(1)}
            </div>
            <div className="mt-1 text-sm text-white/60">
              Ask about check-in, parking, breakfast, policies, and what’s nearby.
            </div>
          </div>

          {isUnauthorized && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Unauthorized link. Ask reception for the official QR code.
            </div>
          )}

          <div className="h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-white text-black" : "bg-white/10 text-white"
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
            {hotel === "demo" ? "Demo mode: no key required." : "Hotel mode: access is controlled by the hotel."}
          </div>
        </div>
      </div>
    </div>
  );
}