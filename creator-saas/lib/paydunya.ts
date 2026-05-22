const PAYDUNYA_BASE = "https://app.paydunya.com/api/v1";

function headers() {
  return {
    "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY!,
    "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY!,
    "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN!,
    "Content-Type": "application/json",
  };
}

export const PLANS = [
  { id: "starter", name: "Starter", amount: 3000, credits: 50 },
  { id: "pro", name: "Pro", amount: 6000, credits: 200 },
  { id: "agency", name: "Agency", amount: 9000, credits: 99999 },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export async function createInvoice({
  planId,
  userId,
  userEmail,
  returnUrl,
  cancelUrl,
}: {
  planId: PlanId;
  userId: string;
  userEmail: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error("Plan introuvable");

  const res = await fetch(`${PAYDUNYA_BASE}/checkout-invoice/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      invoice: {
        items: {
          [plan.name]: {
            name: `Abonnement Creator — ${plan.name}`,
            quantity: 1,
            unit_price: plan.amount,
            total_price: plan.amount,
            description: `${plan.credits === 99999 ? "Crédits illimités" : `${plan.credits} crédits`} / mois`,
          },
        },
        total_amount: plan.amount,
        description: `Abonnement Creator ${plan.name} — ${plan.amount} XOF/mois`,
      },
      store: {
        name: "Creator",
      },
      actions: {
        cancel_url: cancelUrl,
        return_url: returnUrl,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paydunya`,
      },
      custom_data: {
        user_id: userId,
        user_email: userEmail,
        plan_id: planId,
      },
    }),
  });

  if (!res.ok) throw new Error(`PayDunya error: ${await res.text()}`);
  const data = await res.json();
  if (data.response_code !== "00") throw new Error(data.response_text);
  return data as { token: string; response_code: string; response_text: string };
}

export async function confirmInvoice(token: string) {
  const res = await fetch(`${PAYDUNYA_BASE}/checkout-invoice/confirm/${token}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`PayDunya confirm error: ${await res.text()}`);
  return res.json();
}

export function getCheckoutUrl(token: string) {
  return `https://app.paydunya.com/checkout/checkout-invoice/${token}`;
}
