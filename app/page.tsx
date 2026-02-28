"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const searchParams = useSearchParams();

  const hotelId = useMemo(() => {
    const h = searchParams.get("hotel");
    return h ? h.trim() : "pembroke";
  }, [searchParams]);

  const hotelDisplayName = useMemo(() => {
    switch (hotelId) {
      case "hotel-kilkenny":
        return "Hotel Kilkenny";
      case "pembroke":
      default:
        return "Pembroke Hotel";
    }
  }, [hotelId]);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data?.error || "Unknown error"}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data?.reply || "No reply returned." },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${e?.message || "Request failed"}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: 32 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        {/* Clean branded header */}
        <h1 style={{ fontSize: 36, marginBottom: 4 }}>
          {hotelDisplayName} AI Concierge
        </h1>
        <div style={{ opacity: 0.6, marginBottom: 20 }}>
          24-hour digital guest assistant
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 14,
            padding: 20,
            minHeight: 420,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ opacity: 0.6 }}>How can I assist you today?</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    background: m.role === "user" ? "#2563eb" : "#e5e7eb",
                    color: m.role === "user" ? "#fff" : "#111",
                    padding: "12px 14px",
                    borderRadius: 14,
                    maxWidth: "75%",
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                  }}
                >
                  {m.content}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              outline: "none",
              fontSize: 14,
            }}
          />
          <button
            onClick={send}
            disabled={loading}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontSize: 14,
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Subtle SaaS branding */}
        <div style={{ marginTop: 28, fontSize: 12, opacity: 0.4 }}>
          Powered by 24hour Concierge
        </div>
      </div>
    </main>
  );
}