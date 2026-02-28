import OpenAI from "openai";

export const runtime = "nodejs"; // important for the OpenAI SDK on Next.js

type ChatBody = {
  message?: string;
};

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as ChatBody;

    if (!message || !message.trim()) {
      return Response.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful hotel concierge. Keep answers concise, practical, and friendly.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";

    return Response.json({ reply });
  } catch (err: any) {
    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}