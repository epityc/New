import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const video = await prisma.video.findUnique({
    where: { id: params.id },
    select: { userId: true, status: true, finalVideoUrl: true, errorMessage: true },
  });

  if (!video || video.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: video.status,
    finalVideoUrl: video.finalVideoUrl,
    errorMessage: video.errorMessage,
  });
}
