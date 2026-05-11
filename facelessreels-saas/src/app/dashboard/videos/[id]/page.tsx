import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Download, ArrowLeft, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoStatusPoller } from "@/components/dashboard/VideoStatusPoller";

const STATUS_STEPS = [
  { key: "SCRIPTING",        label: "Writing script" },
  { key: "GENERATING_AUDIO", label: "Generating audio" },
  { key: "FETCHING_FOOTAGE", label: "Fetching footage" },
  { key: "RENDERING",        label: "Rendering video" },
  { key: "COMPLETED",        label: "Done!" },
] as const;

type VideoStatus = "PENDING" | "SCRIPTING" | "GENERATING_AUDIO" | "FETCHING_FOOTAGE" | "RENDERING" | "COMPLETED" | "FAILED";

function getStepIndex(status: VideoStatus) {
  const keys = STATUS_STEPS.map((s) => s.key);
  return keys.indexOf(status as any);
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video || video.userId !== user.id) notFound();

  const activeStep = getStepIndex(video.status as VideoStatus);
  const isDone = video.status === "COMPLETED";
  const isFailed = video.status === "FAILED";
  const isProcessing = !isDone && !isFailed;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/videos" className="flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors w-fit">
        <ArrowLeft size={14} /> Back to videos
      </Link>

      {/* Auto-refresh while processing */}
      <VideoStatusPoller videoId={video.id} currentStatus={video.status} />

      <h1 className="text-2xl font-bold mb-1 truncate">{video.topic || "Untitled"}</h1>
      <p className="text-white/40 text-sm mb-8">
        {new Date(video.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {/* Progress tracker */}
      {isProcessing && (
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Loader2 size={16} className="animate-spin text-violet-400" />
            <span className="text-sm font-medium text-violet-400">Processing your video…</span>
          </div>
          <div className="space-y-3">
            {STATUS_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                  i < activeStep ? "bg-violet-600" : i === activeStep ? "bg-violet-600/40 ring-2 ring-violet-500" : "bg-white/5"
                )}>
                  {i < activeStep ? <CheckCircle size={14} className="text-white" /> : i === activeStep ? <Loader2 size={12} className="animate-spin text-violet-300" /> : <span className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                </div>
                <span className={cn("text-sm", i <= activeStep ? "text-white" : "text-white/30")}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-6">Refresh the page to check progress. Usually takes 2–4 minutes.</p>
        </div>
      )}

      {/* Failed state */}
      {isFailed && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
          <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300">Generation failed</p>
            <p className="text-xs text-red-400/70 mt-1">{video.errorMessage || "An unknown error occurred."}</p>
          </div>
        </div>
      )}

      {/* Done — video player */}
      {isDone && video.finalVideoUrl && (
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden mb-6">
          <video
            src={video.finalVideoUrl}
            controls
            className="w-full max-h-[70vh] bg-black"
            playsInline
          />
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle size={14} />
              <span>Your video is ready</span>
            </div>
            <a
              href={video.finalVideoUrl}
              download
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      )}

      {/* Settings summary */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white/60 mb-4">Video Settings</h2>
        <dl className="grid grid-cols-2 gap-3">
          {[
            { label: "Topic", value: video.topic || video.niche || "—" },
            { label: "Duration", value: `${video.durationTarget}s` },
            { label: "Language", value: video.language === "en" ? "English" : "Français" },
            { label: "Visual Style", value: video.artStyle.replace(/_/g, " ") },
            { label: "Captions", value: video.captionStyle.replace(/_/g, " ") },
            { label: "Status", value: video.status },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/3 rounded-xl p-3">
              <dt className="text-xs text-white/30 mb-1">{label}</dt>
              <dd className="text-sm font-medium capitalize">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
