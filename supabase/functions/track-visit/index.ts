import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashFingerprint(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function parseUA(ua: string) {
  const lower = ua.toLowerCase();

  // Device type
  let device_type = "desktop";
  if (/tablet|ipad|playbook|silk/.test(lower)) device_type = "tablet";
  else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(lower)) device_type = "mobile";

  // Browser
  let browser = "Other";
  if (/edg(e|a)?\//.test(lower)) browser = "Edge";
  else if (/opr\/|opera/.test(lower)) browser = "Opera";
  else if (/firefox|fxios/.test(lower)) browser = "Firefox";
  else if (/chrome|chromium|crios/.test(lower)) browser = "Chrome";
  else if (/safari/.test(lower) && !/chrome/.test(lower)) browser = "Safari";

  // OS
  let os = "Other";
  if (/windows/.test(lower)) os = "Windows";
  else if (/macintosh|mac os/.test(lower)) os = "macOS";
  else if (/linux/.test(lower) && !/android/.test(lower)) os = "Linux";
  else if (/android/.test(lower)) os = "Android";
  else if (/iphone|ipad|ipod/.test(lower)) os = "iOS";

  return { device_type, browser, os };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { page_path, referrer, session_id, session_duration, visitor_cookie } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    const ua = req.headers.get("user-agent") || "unknown";

    // Use cookie-based ID if available, fallback to IP+UA fingerprint
    const visitor_id = visitor_cookie || (await hashFingerprint(`${ip}::${ua}`));
    const country = req.headers.get("cf-ipcountry") || null;
    const { device_type, browser, os } = parseUA(ua);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // If session_duration provided, update existing record instead of inserting
    if (session_duration && session_id) {
      await supabase
        .from("page_views")
        .update({ session_duration: Math.round(session_duration) })
        .eq("session_id", session_id);
    } else {
      await supabase.from("page_views").insert({
        page_path: page_path || "/",
        referrer: referrer || null,
        visitor_id,
        country,
        device_type,
        browser,
        os,
        session_id: session_id || crypto.randomUUID(),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
