import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { creditsBalance: true },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar creditsBalance={user?.creditsBalance ?? 0} />
      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
