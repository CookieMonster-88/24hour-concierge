// app/api/chat/route.ts

import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

import { PEMBROKE } from "@/app/hotels/pembroke";
import { HOTEL_KILKENNY } from "@/app/hotels/hotel-kilkenny";
import { LANGTONS } from "@/app/hotels/langtons";
import { KILKENNY_ORMONDE } from "@/app/hotels/kilkenny-ormonde";
import { NEWPARK } from "@/app/hotels/newpark";
import { RIVER_COURT } from "@/app/hotels/river-court";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type Hotel = {
  id: string;
  displayName: string;
  location: string;
  knowledge: string;
};

const HOTEL_MAP: Record<string, Hotel> = {
  [PEMBROKE.id]: PEMBROKE,
  [HOTEL_KILKENNY.id]: HOTEL_KILKENNY,
  [LANGTONS.id]: LANGTONS,
  [KILKENNY_ORMONDE.id]: KILKENNY_ORMONDE,
  [NEWPARK.id]: NEWPARK,
  [RIVER_COURT.id]: RIVER_COURT,
};

const DEFAULT_HOTEL_ID = process.env.DEFAULT_HOTEL_ID || "pembroke";

const HOTEL_KEYS = JSON.parse(
  process.env.HOTEL_KEYS_JSON || "{}"
) as Record<string, string>;

const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 300);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20);
const SESSION_MAX = Number(process.env.SESSION_MAX_MESSAGES || 40);
const DAILY_LIMIT = Number(
  process.env.DAILY_HOTEL_MESSAGE_LIMIT_DEFAULT || 300
);

const ipStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW * 1000,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

function getActiveHotel(reqUrl: string) {
  const url = new URL(reqUrl);
  const hotelId =
    url.searchParams.get("hotel")?.toLowerCase() || DEFAULT_HOTEL_ID;

  return HOTEL_MAP[hotelId] || HOTEL_MAP[DEFAULT_HOTEL_ID];
}

function validateHotelKey(req: Request, hotelId: string) {
  const key = req.headers.get("x-hotel-key");
  if (!HOTEL_KEYS[hotelId]) return false;
  return key === HOTEL_KEYS[hotelId];
}

function buildSystemPrompt(hotel: Hotel) {
  return `
You are a hotel concierge chatbot for ${hotel.displayName} in ${hotel.location}.

STRICT RULES:
- Use ONLY the hotel knowledge base provided below.
- If unsure, say: "I’m not certain — I can check with reception."
- Keep answers short and helpful.

HOTEL KNOWLEDGE BASE:
${hotel.knowledge}
`.trim();
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (!rateLimit(ip)) {
      return Response.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const hotel = getActiveHotel(req.url);

    if (!validateHotelKey(req, hotel.id)) {
      return Response.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const messages = body?.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided." }, { status: 400 });
    }

    if (messages.length > SESSION_MAX) {
      return Response.json(
        { error: "Session message limit reached." },
        { status: 403 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const { count } = await supabaseAdmin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("hotel_id", hotel.id)
      .gte("created_at", `${today}T00:00:00Z`);

    if ((count || 0) >= DAILY_LIMIT) {
      return Response.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(hotel) },
        ...messages,
      ],
      temperature: 0.2,
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Please try again.";

    await supabaseAdmin.from("usage_logs").insert({
      hotel_id: hotel.id,
      user_question:
        messages[messages.length - 1]?.content || "",
      ai_reply: reply,
      ip,
      user_agent: req.headers.get("user-agent"),
    });

    return Response.json({ reply });
  } catch (err: any) {
    return Response.json(
      { error: err?.message || "Server error." },
      { status: 500 }
    );
  }
}