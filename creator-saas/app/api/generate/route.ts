import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage, generateVideo, pollGeneration } from "@/lib/arcads";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { type, model, prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "Prompt requis" }, { status: 400 });

  // Check credits
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_remaining, plan")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits_remaining <= 0) {
    return NextResponse.json({ error: "Crédits insuffisants. Veuillez upgrader votre plan." }, { status: 402 });
  }

  // Start generation
  let arcadsId: string;
  const creditsUsed = type === "image" ? 0.03 : model === "veo-3.1" ? 1 : model === "kling-3" ? 2 : 3;

  try {
    let result;
    if (type === "image") {
      result = await generateImage(prompt);
    } else {
      result = await generateVideo(prompt, model);
    }
    arcadsId = result.id;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  // Save generation record
  const { data: gen } = await supabase.from("generations").insert({
    user_id: user.id,
    arcads_id: arcadsId,
    type,
    model: type === "image" ? "nano-banana-2" : model,
    prompt,
    status: "pending",
    credits_used: creditsUsed,
  }).select().single();

  // Deduct credits optimistically
  await supabase.from("profiles").update({
    credits_remaining: profile.credits_remaining - Math.ceil(creditsUsed),
  }).eq("id", user.id);

  // Poll for result (up to 5 minutes)
  const final = await pollGeneration(arcadsId);

  if (final.status === "completed" && final.url) {
    await supabase.from("generations").update({
      status: "completed",
      output_url: final.url,
    }).eq("id", gen!.id);
    return NextResponse.json({ status: "completed", url: final.url });
  }

  await supabase.from("generations").update({ status: final.status }).eq("id", gen!.id);
  return NextResponse.json({ status: final.status });
}
