import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Zap } from "lucide-react";

const CREDIT_PACKS = [
  { id: "starter",   name: "Starter",   credits: 10,  price: 9,  popular: false },
  { id: "pro",       name: "Pro",       credits: 50,  price: 29, popular: true  },
  { id: "unlimited", name: "Unlimited", credits: 200, price: 79, popular: false },
];

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      transactions: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!user) redirect("/sign-in");

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Credits & Billing</h1>
        <p className="text-white/40 text-sm mt-1">
          Current balance: <span className="text-violet-400 font-semibold">{user.creditsBalance} credits</span>
        </p>
      </div>

      {/* Credit packs */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {CREDIT_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`relative flex flex-col bg-[#111111] border rounded-2xl p-5 ${pack.popular ? "border-violet-500" : "border-white/5"}`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-violet-600 text-white px-3 py-1 rounded-full font-semibold">
                Most Popular
              </span>
            )}
            <p className="font-bold text-lg">{pack.name}</p>
            <p className="text-3xl font-bold mt-2 mb-1">${pack.price}</p>
            <p className="text-white/40 text-sm mb-4">{pack.credits} credits</p>
            <p className="text-xs text-white/30 mb-6">${(pack.price / pack.credits).toFixed(2)} / video</p>
            <form action="/api/checkout" method="POST" className="mt-auto">
              <input type="hidden" name="packId" value={pack.id} />
              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${pack.popular ? "bg-violet-600 hover:bg-violet-500" : "bg-white/5 hover:bg-white/10 text-white/80"}`}
              >
                Buy {pack.credits} Credits
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      {user.transactions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
            {user.transactions.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between px-5 py-3 ${i < user.transactions.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type.toLowerCase().replace("_", " ")}</p>
                  <p className="text-xs text-white/30">
                    {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${tx.credits > 0 ? "text-green-400" : "text-red-400"}`}>
                  {tx.credits > 0 ? "+" : ""}{tx.credits} cr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
