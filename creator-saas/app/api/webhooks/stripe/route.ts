import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_CREDITS: Record<string, number> = {
  [process.env.STRIPE_PRICE_STARTER_ID ?? ""]: 50,
  [process.env.STRIPE_PRICE_PRO_ID ?? ""]: 200,
  [process.env.STRIPE_PRICE_AGENCY_ID ?? ""]: 99999,
};

const PLAN_NAMES: Record<string, string> = {
  [process.env.STRIPE_PRICE_STARTER_ID ?? ""]: "starter",
  [process.env.STRIPE_PRICE_PRO_ID ?? ""]: "pro",
  [process.env.STRIPE_PRICE_AGENCY_ID ?? ""]: "agency",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const priceId = session.metadata?.priceId ?? "";

    if (userId) {
      const credits = PLAN_CREDITS[priceId] ?? 50;
      const plan = PLAN_NAMES[priceId] ?? "starter";

      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        plan,
        credits_remaining: credits,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      });
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
    if (!subscriptionId) return NextResponse.json({ ok: true });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id ?? "";
    const credits = PLAN_CREDITS[priceId] ?? 50;
    const plan = PLAN_NAMES[priceId] ?? "starter";

    const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
    if (customerId) {
      await supabaseAdmin.from("profiles")
        .update({ credits_remaining: credits, plan })
        .eq("stripe_customer_id", customerId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    await supabaseAdmin.from("profiles")
      .update({ plan: null, credits_remaining: 0 })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ ok: true });
}
