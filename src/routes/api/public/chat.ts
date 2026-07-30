import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `أنت "Elevate AI"، المساعد الذكي لمنصة Elevate التي تجمع الفرص للطلاب:
منح دراسية، مسابقات، وظائف، تطوع، كورسات مجانية، ورش عمل، فرص سفر ممولة، وقبول جامعي.
أجب دائماً بنفس لغة المستخدم (عربي أو إنجليزي)، بأسلوب ودود ومختصر وعملي،
وساعد المستخدم في اختيار الفرص المناسبة وطريقة التقديم وكتابة السيرة الذاتية وخطاب الدافع.`;

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return json({ error: "AI not configured" }, 500);

        let body: { messages?: ChatMessage[] };
        try {
          body = (await request.json()) as { messages?: ChatMessage[] };
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const messages = (body.messages ?? [])
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim().length > 0,
          )
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

        if (messages.length === 0) return json({ error: "messages required" }, 400);

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`AI gateway error [${res.status}]: ${text}`);
          if (res.status === 429) return json({ error: "rate_limited" }, 429);
          if (res.status === 402) return json({ error: "payment_required" }, 402);
          return json({ error: "ai_error" }, 500);
        }

        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const reply = data.choices?.[0]?.message?.content?.trim() ?? "";
        return json({ reply });
      },
    },
  },
});
