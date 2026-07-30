import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_KEYS = new Set([
  "luxen_general_cards",
  "luxen_partners",
  "luxen_comments",
  "luxen_likes",
  "luxen_all_users",
  "luxen_notifications",
  "luxen_category_status",
]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/public/store")({
  server: {
    handlers: {
      GET: async () => {
        let rows: { key: string; value: unknown }[] | null = null;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.from("site_store").select("key,value");
          if (error) throw error;
          rows = data as { key: string; value: unknown }[];
        } catch {
          // Fallback: public read policy allows the publishable key to read the store.
          const { createClient } = await import("@supabase/supabase-js");
          const client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
          );
          const { data, error } = await client.from("site_store").select("key,value");
          if (error) return json({ error: error.message }, 500);
          rows = data as { key: string; value: unknown }[];
        }
        const out: Record<string, unknown> = {};
        for (const row of rows ?? []) out[row.key] = row.value;
        return json({ data: out });
      },

      POST: async ({ request }) => {
        let body: { key?: string; value?: unknown };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        const key = typeof body.key === "string" ? body.key : "";
        if (!ALLOWED_KEYS.has(key)) return json({ error: "Unknown key" }, 400);
        if (body.value === undefined) return json({ error: "Missing value" }, 400);
        const serialized = JSON.stringify(body.value);
        if (serialized.length > 2_000_000) return json({ error: "Payload too large" }, 413);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("site_store")
          .upsert({ key, value: body.value as never, updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true });
      },
    },
  },
});
