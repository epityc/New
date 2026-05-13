import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter", price: "$49/mois", credits: 50, priceId: process.env.STRIPE_PRICE_STARTER_ID },
  { name: "Pro", price: "$149/mois", credits: 200, priceId: process.env.STRIPE_PRICE_PRO_ID, highlighted: true },
  { name: "Agency", price: "$399/mois", credits: 9999, priceId: process.env.STRIPE_PRICE_AGENCY_ID },
];

async function createCheckoutAction(priceId: string, userId: string) {
  "use server";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    metadata: { userId },
  });
  return session.url!;
}

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("plan, credits_remaining").eq("id", user!.id).single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Abonnement</h1>
      <p className="text-gray-500 text-sm mb-8">Plan actuel : <span className="font-semibold capitalize text-gray-900">{profile?.plan ?? "Aucun"}</span> — {profile?.credits_remaining ?? 0} crédits restants</p>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlighted ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"}`}>
            <h2 className="font-bold text-lg mb-1">{plan.name}</h2>
            <p className="text-2xl font-bold mb-1">{plan.price}</p>
            <p className="text-sm text-gray-500 mb-6">{plan.credits === 9999 ? "Crédits illimités" : `${plan.credits} crédits / mois`}</p>
            <form action={async () => {
              "use server";
              if (!plan.priceId) return;
              const url = await createCheckoutAction(plan.priceId, user!.id);
              // redirect is imported at runtime
              const { redirect } = await import("next/navigation");
              redirect(url);
            }}>
              <button
                type="submit"
                disabled={!plan.priceId}
                className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${plan.highlighted ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-900 text-white hover:bg-gray-800"} disabled:opacity-40`}
              >
                {profile?.plan === plan.name.toLowerCase() ? "Plan actuel" : "Choisir ce plan"}
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 max-w-4xl">
        <Check size={14} className="inline mr-1 text-green-500" />
        Sans engagement — annulable à tout moment depuis le portail Stripe.
      </div>
    </div>
  );
}
