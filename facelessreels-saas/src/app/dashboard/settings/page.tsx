import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@clerk/nextjs";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and preferences</p>
      </div>
      <UserProfile
        appearance={{
          variables: {
            colorBackground: "#111111",
            colorText: "#ffffff",
            colorPrimary: "#7c3aed",
            colorInputBackground: "#1a1a1a",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
}
