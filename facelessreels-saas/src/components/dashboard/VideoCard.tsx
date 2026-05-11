"use client";

import Link from "next/link";
import { Download, Loader2, Clock, CheckCircle, XCircle, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoStatus = "PENDING" | "SCRIPTING" | "GENERATING_AUDIO" | "FETCHING_FOOTAGE" | "RENDERING" | "COMPLETED" | "FAILED";

interface VideoCardProps {
  id: string;
  topic: string;
  niche: string | null;
  artStyle: string;
  status: VideoStatus;
  finalVideoUrl: string | null;
  createdAt: Date;
  durationTarget: number;
}

const STATUS_CONFIG: Record<VideoStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:          { label: "Queued",     color: "text-white/40",    icon: <Clock size={12} /> },
  SCRIPTING:        { label: "Writing...", color: "text-blue-400",    icon: <Loader2 size={12} className="animate-spin" /> },
  GENERATING_AUDIO: { label: "Voicing...", color: "text-purple-400",  icon: <Loader2 size={12} className="animate-spin" /> },
  FETCHING_FOOTAGE: { label: "Footage...", color: "text-orange-400",  icon: <Loader2 size={12} className="animate-spin" /> },
  RENDERING:        { label: "Rendering",  color: "text-yellow-400",  icon: <Loader2 size={12} className="animate-spin" /> },
  COMPLETED:        { label: "Ready",      color: "text-green-400",   icon: <CheckCircle size={12} /> },
  FAILED:           { label: "Failed",     color: "text-red-400",     icon: <XCircle size={12} /> },
};

export function VideoCard({ id, topic, niche, artStyle, status, finalVideoUrl, createdAt, durationTarget }: VideoCardProps) {
  const cfg = STATUS_CONFIG[status];
  const isProcessing = ["PENDING", "SCRIPTING", "GENERATING_AUDIO", "FETCHING_FOOTAGE", "RENDERING"].includes(status);

  return (
    <Link
      href={`/dashboard/videos/${id}`}
      className="group flex flex-col bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] w-full bg-white/3 flex items-center justify-center overflow-hidden">
        {finalVideoUrl ? (
          <video
            src={finalVideoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <Clapperboard size={32} />
            {isProcessing && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Loader2 size={12} className="animate-spin" />
                {cfg.label}
              </div>
            )}
          </div>
        )}

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white/70 px-1.5 py-0.5 rounded-md">
          {durationTarget}s
        </span>

        {/* Download button overlay */}
        {status === "COMPLETED" && finalVideoUrl && (
          <a
            href={finalVideoUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-violet-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Download size={14} />
          </a>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <p className="text-sm font-medium truncate leading-snug">
          {topic || niche || "Untitled"}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30 capitalize">{artStyle.replace(/_/g, " ")}</span>
          <div className={cn("flex items-center gap-1 text-xs font-medium", cfg.color)}>
            {cfg.icon}
            {cfg.label}
          </div>
        </div>
        <p className="text-xs text-white/20 mt-auto">
          {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </div>
    </Link>
  );
}
