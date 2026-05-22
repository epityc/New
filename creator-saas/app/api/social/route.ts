import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnalytics } from "@/lib/dansugc";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const range = req.nextUrl.searchParams.get("range") ?? "30d";

  try {
    const [analytics, publications] = await Promise.all([
      getAnalytics(range),
      supabase.from("publications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    return NextResponse.json({ analytics, publications: publications.data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
