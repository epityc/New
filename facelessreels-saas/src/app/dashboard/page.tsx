import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GenerateForm } from "@/components/dashboard/GenerateForm";
import { VideoCard } from "@/components/dashboard/VideoCard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      videos: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });

  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Generate a Video</h1>
        <p className="text-white/40 text-sm mt-1">
          You have <span className="text-violet-400 font-semibold">{user.creditsBalance} credit{user.creditsBalance !== 1 ? "s" : ""}</span> remaining
        </p>
      </div>

      {/* Wizard */}
      <GenerateForm />

      {/* Recent videos */}
      {user.videos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Videos</h2>
            <a href="/dashboard/videos" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {user.videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                topic={video.topic}
                niche={video.niche}
                artStyle={video.artStyle}
                status={video.status}
                finalVideoUrl={video.finalVideoUrl}
                createdAt={video.createdAt}
                durationTarget={video.durationTarget}
              />
            ))}
          </div>
        </div>
      )}

      {user.videos.length === 0 && (
        <div className="text-center py-16 text-white/20">
          <p className="text-lg font-medium">No videos yet</p>
          <p className="text-sm mt-1">Generate your first faceless video above</p>
        </div>
      )}
    </div>
  );
}
