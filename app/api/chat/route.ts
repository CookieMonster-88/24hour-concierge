// app/api/chat/route.ts

import OpenAI from "openai";
import { getHotelById } from "@/app/hotels";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function buildSystemPrompt(hotel: {
  displayName: string;
  location: string;
  knowledge: string;
}) {
  return `
You are a hotel concierge chatbot for ${hotel.displayName} in ${hotel.location}.

STRICT RULES:
- Use ONLY the hotel knowledge base provided below for hotel-specific facts.
- If the user asks something not in the knowledge base, do NOT guess.
  Say: "I’m not certain — I can check with reception." Then ask one short follow-up question if needed.
- Keep answers short, clear, and helpful.
- If the user asks for personal data, payment details, or anything sensitive: refuse and recommend contacting reception.

HOTEL KNOWLEDGE BASE:
${hotel.knowledge}
`.trim();
}

function normalizeIncomingMessages(body: any): ChatMessage[] {
  if (typeof body?.message === "string" && body.message.trim()) {
    return [{ role: "user", content: body.message.trim() }];
  }

  if (Array.isArray(body?.messages)) {
    const cleaned = body.messages
      .filter(
        (m: any) =>
          m && typeof m.role === "string" && typeof m.content === "string"
      )
      .map((m: any) => ({
        role: m.role as ChatMessage["role"],
        content: m.content,
      }))
      .filter((m: ChatMessage) => ["user", "assistant"].includes(m.role));

    if (cleaned.length) return cleaned;
  }

  return [];
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const body = await req.json();

    // ✅ hotelId comes from the UI via URL-based selection
    const hotelId =
      typeof body?.hotelId === "string" ? body.hotelId.trim() : null;

    const hotel = getHotelById(hotelId);

    const incoming = normalizeIncomingMessages(body);

    if (!incoming.length) {
      return Response.json(
        { error: "No message provided. Send { message: string } or { messages: [...] }." },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(hotel) },
      ...incoming,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry — I didn’t get a response. Please try again.";

    return Response.json({
      reply,
      hotel: { id: hotel.id, displayName: hotel.displayName },
    });
  } catch (err: any) {
    const message = err?.message || (typeof err === "string" ? err : "Unknown server error");
    return Response.json({ error: message }, { status: 500 });
  }
}