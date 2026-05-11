"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  videoId: string;
  currentStatus: string;
}

const TERMINAL_STATES = new Set(["COMPLETED", "FAILED"]);
const POLL_INTERVAL_MS = 4000;

export function VideoStatusPoller({ videoId, currentStatus }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (TERMINAL_STATES.has(currentStatus)) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/videos/${videoId}/status`);
        if (!res.ok) return;
        const { status } = await res.json();
        if (status !== currentStatus) {
          router.refresh(); // re-runs the Server Component with fresh DB data
        }
        if (TERMINAL_STATES.has(status)) clearInterval(interval);
      } catch {
        // ignore network errors, retry on next tick
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [videoId, currentStatus, router]);

  return null;
}
