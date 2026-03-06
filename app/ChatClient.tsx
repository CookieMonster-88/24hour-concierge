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
  return raw && raw.length > 0 ? raw : "demo";
}

function getHotelKeyFromParams(params: URLSearchParams | null) {
  const raw = (params?.get("k") || params?.get("key") || "").trim();
  return raw.length > 0 ? raw : "";
}

function isUrl(str: string) {
  return /^https?:\/\//.test(str);
}

function renderMessage(content: string) {
  const urlRegex = /(https?:\/\/[^\s)]+)/g;
  const lines = content.split("\n");

  return lines.map((line, lineIdx) => {
    const parts = line.split(urlRegex);
    return (
      <span key={lineIdx}>
        {parts.map((part, partIdx) =>
          isUrl(part) ? (
            
              key={partIdx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300 hover:text-blue-200 break-all"
            >
              {part.includes("maps") ? "📍 Open in Google Maps" : part}
            </a>
          ) : (
            <span key={partIdx}>{part}</span>
          )
        )}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

const LANGUAGES = ["EN", "FR", "DE", "ES", "IT", "ZH", "AR"];

export default function ChatClient() {
  const searchParams = useSearchParams();

  const hotel = useMemo(() => getHotelFromParams(searchParams), [searchParams]);
  const hotelKey = useMemo(() => getHotelKeyFromParams(searchParams), [searchParams]);

  const requiresKey = hotel !== "demo";
  const isUnauthorized = requiresKey && !hotelKey;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi — I'm your Concierge 24 assistant. Ask me anything about the hotel.",
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
          content: "Unauthorized link. Please ask reception for the official QR code provided by the hotel.",
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
              Ask about check-in, parking, breakfast, policies, and what's nearby.
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-white/30 tracking-widest uppercase">Speaks</span>
              <div className="flex gap-1">
                {LANGUAGES.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium tracking-wider text-white/40"
                  >
                    {lang}
                  </span>
                ))}
              </div>
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-white text-black" : "bg-white/10 text-white"
                  }`}
                >
                  {renderMessage(m.content)}
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