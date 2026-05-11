import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoCard } from "@/components/dashboard/VideoCard";

export default async function VideosPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      videos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/sign-in");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Videos</h1>
        <p className="text-white/40 text-sm mt-1">{user.videos.length} video{user.videos.length !== 1 ? "s" : ""} generated</p>
      </div>

      {user.videos.length === 0 ? (
        <div className="text-center py-24 text-white/20">
          <p className="text-lg font-medium">No videos yet</p>
          <p className="text-sm mt-1">
            <a href="/dashboard" className="text-violet-400 hover:text-violet-300">Generate your first video →</a>
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
