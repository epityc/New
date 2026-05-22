import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPost, listPostingAccounts } from "@/lib/dansugc";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { videoUrl, caption, accountIds, scheduledFor, publishNow } = await req.json();

  if (!videoUrl || !caption || !accountIds?.length) {
    return NextResponse.json({ error: "videoUrl, caption et accountIds sont requis" }, { status: 400 });
  }

  try {
    const post = await createPost({ content: caption, mediaUrl: videoUrl, accountIds, scheduledFor, publishNow });

    await supabase.from("publications").insert({
      user_id: user.id,
      video_url: videoUrl,
      caption,
      account_ids: accountIds,
      scheduled_for: scheduledFor ?? null,
      publish_now: publishNow ?? false,
      dansugc_post_id: post.id,
      status: publishNow ? "published" : "scheduled",
    });

    return NextResponse.json({ success: true, post });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const accounts = await listPostingAccounts();
    return NextResponse.json(accounts);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
