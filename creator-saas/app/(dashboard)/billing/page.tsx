import { createClient } from "@/lib/supabase/server";
import { PLANS, createInvoice } from "@/lib/paydunya";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, credits_remaining")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Abonnement</h1>
      <p className="text-gray-500 text-sm mb-8">
        Plan actuel :{" "}
        <span className="font-semibold capitalize text-gray-900">{profile?.plan ?? "Aucun"}</span>
        {" "}— {profile?.credits_remaining ?? 0} crédits restants
      </p>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
        {PLANS.map((plan) => {
          const isCurrent = profile?.plan === plan.id;
          const highlighted = plan.id === "pro";

          return (
            <div key={plan.id} className={`rounded-2xl p-6 border ${highlighted ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white"}`}>
              <h2 className="font-bold text-lg mb-1">{plan.name}</h2>
              <p className="text-2xl font-bold mb-1">
                {plan.amount.toLocaleString("fr-FR")} <span className="text-base font-normal text-gray-500">XOF/mois</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {plan.credits === 99999 ? "Crédits illimités" : `${plan.credits} crédits / mois`}
              </p>

              {isCurrent ? (
                <div className="w-full py-2 rounded-lg text-sm font-semibold text-center bg-gray-100 text-gray-500">
                  Plan actuel
                </div>
              ) : (
                <form action={async () => {
                  "use server";
                  const invoice = await createInvoice({
                    planId: plan.id,
                    userId: user!.id,
                    userEmail: user!.email!,
                    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
                    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
                  });
                  redirect(`https://app.paydunya.com/checkout/checkout-invoice/${invoice.token}`);
                }}>
                  <button
                    type="submit"
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${highlighted ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                  >
                    Choisir {plan.name}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 max-w-4xl">
        <Check size={14} className="inline mr-1 text-green-500" />
        Paiement sécurisé via PayDunya — Orange Money, Wave, Free Money, carte bancaire.
      </div>
    </div>
  );
}
