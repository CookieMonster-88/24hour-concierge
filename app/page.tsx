"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: text },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply || "No response" },
      ]);
    } catch (error: any) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        24hour Concierge Chat
      </h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 20,
          minHeight: 400,
          marginBottom: 20,
        }}
      >
        {messages.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Start the conversation...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: 10,
                textAlign: msg.role === "user" ? "right" : "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background:
                    msg.role === "user" ? "#0070f3" : "#e5e5e5",
                  color:
                    msg.role === "user" ? "white" : "black",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </main>
  );
}