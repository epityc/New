import { NextRequest, NextResponse } from "next/server";
import { confirmInvoice, PLANS } from "@/lib/paydunya";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body?.data?.invoice?.token;
  if (!token) return NextResponse.json({ error: "Token manquant" }, { status: 400 });

  const invoice = await confirmInvoice(token);
  if (invoice.status !== "completed") return NextResponse.json({ ok: true });

  const { user_id, plan_id } = invoice.custom_data ?? {};
  if (!user_id || !plan_id) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

  const plan = PLANS.find((p) => p.id === plan_id);
  if (!plan) return NextResponse.json({ error: "Plan introuvable" }, { status: 400 });

  await supabaseAdmin.from("profiles").upsert({
    id: user_id,
    plan: plan.id,
    credits_remaining: plan.credits,
  });

  return NextResponse.json({ ok: true });
}
