// app/api/chat/route.ts
import { NextResponse } from "next/server";

import { DEMO } from "../../hotels/demo";
import { PEMBROKE } from "../../hotels/pembroke";

export const runtime = "nodejs";

type HotelLike = typeof DEMO;

const HOTEL_MAP: Record<string, HotelLike> = {
  demo: DEMO,
  pembroke: PEMBROKE as unknown as HotelLike,
};

function getHotelById(hotelIdRaw: string | null | undefined): any {
  const key = (hotelIdRaw || "").toLowerCase().trim();
  return HOTEL_MAP[key] || HOTEL_MAP["demo"];
}

function buildSystemPrompt(hotel: any) {
  const name = hotel?.name || hotel?.displayName || "the hotel";

  const phone =
    hotel?.contact?.phone || "+353 (0)56 000 0000";

  const email =
    hotel?.contact?.email || "demo@concierge24.ie";

  const kb =
    typeof hotel?.knowledge === "string"
      ? hotel.knowledge
      : JSON.stringify(hotel, null, 2);

  return `
You are Concierge 24, a hotel assistant for "${name}".

STRICT RULES:

1) Use ONLY the hotel knowledge base below.
2) If the answer exists in the knowledge base → answer clearly and concisely.
3) If the request involves staff action (extra towels, maintenance, housekeeping, wake-up call, etc.) respond EXACTLY as:

Please contact reception directly for assistance.
Phone: ${phone}

4) If the information is NOT in the knowledge base and is informational (not urgent), respond EXACTLY as:

I don't have that detail in this assistant.

You can contact reception:

Phone: ${phone}
Email: ${email}

5) Do NOT mention "knowledge base".
6) Do NOT invent information.
7) Keep responses short and professional.
8) When a guest asks for directions to any place, provide a brief description and include a Google Maps link formatted as: https://www.google.com/maps/search/?api=1&query=PLACE+NAME+Kilkenny with spaces replaced by + signs. Example: https://www.google.com/maps/search/?api=1&query=Kilkenny+Castle+Kilkenny

HOTEL KNOWLEDGE BASE:
${kb}
`.trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({} as any));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const hotelId = body?.hotelId;

    if (!messages.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const hotel = getHotelById(hotelId);
    const systemPrompt = buildSystemPrompt(hotel);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "OpenAI error", detail: text }, { status: 500 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({
      text: content,
      message: content,
      content,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}