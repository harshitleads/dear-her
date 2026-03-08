import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { relationship, senderName, answers } = await req.json();

    // Validate inputs
    if (!relationship || !answers || answers.length !== 3) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const a of answers) {
      if (typeof a !== "string" || a.trim().length === 0 || a.length > 300) {
        return new Response(JSON.stringify({ error: "Each answer must be 1-300 characters" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Hash IP for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + "dear-her-salt-2024");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Check rate limit (3 per 24h per IP)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from("letters")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", twentyFourHoursAgo);

    if (countError) {
      console.error("Count error:", countError);
    }

    if ((count ?? 0) >= 3) {
      return new Response(
        JSON.stringify({
          error: "You've written 3 letters today. Come back tomorrow — she'll still be worth it.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate letter via Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are writing a deeply personal, emotionally resonant letter from one person to a woman they love. The user has given you raw, honest notes about her. Your job is to elevate their words, not replace them. Keep their voice, amplify their feeling. Write in first person, warm and intimate. No clichés. No generic Women's Day copy. Make it feel like the most articulate version of them wrote it. 3-4 paragraphs. Start with 'Dear ${relationship},' and sign with their name. Make her feel truly seen. Never use em dashes (—) anywhere in the letter. If you feel the urge to use an em dash, rewrite the sentence instead. Use periods, commas, or line breaks. The letter must read as human-written, not AI-generated.`;

    const userMessage = `Relationship: ${relationship}
Name signing off: ${senderName || "someone who cares"}

Prompt 1 — A small thing she does:
${answers[0]}

Prompt 2 — A moment only I've seen:
${answers[1]}

Prompt 3 — What I want her to know:
${answers[2]}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 600,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    const generatedLetter = aiData.choices?.[0]?.message?.content;

    if (!generatedLetter) {
      throw new Error("No letter generated");
    }

    // Store in DB
    const { data: letterRecord, error: insertError } = await supabase
      .from("letters")
      .insert({
        relationship,
        raw_input_1: answers[0],
        raw_input_2: answers[1],
        raw_input_3: answers[2],
        sender_name: senderName || null,
        generated_letter: generatedLetter,
        ip_hash: ipHash,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save letter");
    }

    return new Response(JSON.stringify({ id: letterRecord.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-letter error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
