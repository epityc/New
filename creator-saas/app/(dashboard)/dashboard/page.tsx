import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Zap, Video, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_remaining, plan")
    .eq("id", user!.id)
    .single();

  const { count: totalVideos } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: recent } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Zap size={14} />
            Crédits restants
          </div>
          <p className="text-3xl font-bold text-brand-600">{profile?.credits_remaining ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Video size={14} />
            Vidéos générées
          </div>
          <p className="text-3xl font-bold">{totalVideos ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Clock size={14} />
            Plan actuel
          </div>
          <p className="text-3xl font-bold capitalize">{profile?.plan ?? "—"}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-white mb-10">
        <h2 className="text-xl font-bold mb-2">Crée ta prochaine vidéo</h2>
        <p className="text-brand-100 mb-4 text-sm">Décris ton produit et laisse l&apos;IA faire le reste.</p>
        <Link href="/generate" className="inline-block bg-white text-brand-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-brand-50 transition-colors">
          Générer maintenant
        </Link>
      </div>

      {/* Recent */}
      {recent && recent.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4">Dernières générations</h2>
          <div className="grid grid-cols-3 gap-4">
            {recent.map((gen) => (
              <div key={gen.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {gen.output_url ? (
                  <video src={gen.output_url} className="w-full aspect-video object-cover" controls />
                ) : (
                  <div className="w-full aspect-video bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                    {gen.status === "pending" ? "En cours..." : "Échec"}
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs text-gray-500 truncate">{gen.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
