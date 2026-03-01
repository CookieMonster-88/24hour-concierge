"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChatMsg = { role: "user" | "assistant"; content: string };

function getHotelFromParams(params: URLSearchParams) {
  return params.get("hotel")?.toLowerCase() || "pembroke";
}

function getHotelKeyFromParams(params: URLSearchParams) {
  return params.get("k") || "";
}

function prettyHotelName(hotel: string) {
  if (hotel === "pembroke") return "Pembroke Hotel";
  return hotel.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ChatClient() {
  const params = useSearchParams();

  const hotel = useMemo(() => getHotelFromParams(params), [params]);
  const hotelKey = useMemo(() => getHotelKeyFromParams(params), [params]);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m your Concierge 24 assistant. Ask me anything about the hotel.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setMessages([
      {
        role: "assistant",
        content:
          "Hi — I’m your Concierge 24 assistant. Ask me anything about the hotel.",
      },
    ]);
    setInput("");
  }, [hotel]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setLoading(true);

    const nextMessages: ChatMsg[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch(`/api/chat?hotel=${encodeURIComponent(hotel)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hotel-key": hotelKey,
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Request failed.");
        setLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (e: any) {
      setError(e?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur p-5">
        <div className="mb-4">
          <div className="text-sm uppercase tracking-wide text-white/60">
            Concierge 24
          </div>
          <div className="text-xl font-semibold">{prettyHotelName(hotel)}</div>
          <div className="text-sm text-white/60">
            Ask about check-in, parking, breakfast, policies, and what’s nearby.
          </div>
        </div>

        <div className="h-[420px] overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl bg-white text-black px-4 py-2"
                    : "max-w-[85%] rounded-2xl bg-white/10 text-white px-4 py-2"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-white/60">Thinking…</div>}
        </div>

        {error && <div className="mt-3 text-sm text-red-300">{error}</div>}

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type your question…"
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />
          <button
            onClick={send}
            disabled={loading}
            className="rounded-xl bg-white text-black px-4 py-3 font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}