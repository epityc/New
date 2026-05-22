import { createClient } from "@/lib/supabase/server";
import { TrendingUp, Eye, Heart, Users } from "lucide-react";

export default async function SocialPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Réseaux sociaux</h1>

      {/* Stats placeholder — populated via DanSUGC analytics */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { icon: Eye, label: "Vues totales", value: "—" },
          { icon: Heart, label: "Engagements", value: "—" },
          { icon: Users, label: "Nouveaux abonnés", value: "—" },
          { icon: TrendingUp, label: "Taux d'engagement", value: "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Icon size={14} />
              {label}
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Publications */}
      <h2 className="font-semibold mb-4">Publications</h2>
      {!publications || publications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-3">Aucune publication pour l&apos;instant.</p>
          <a href="/pipeline" className="text-brand-600 hover:underline text-sm">Créer et publier une vidéo →</a>
        </div>
      ) : (
        <div className="space-y-3">
          {publications.map((pub) => (
            <div key={pub.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
              <video src={pub.video_url} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{pub.caption}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(pub.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                pub.status === "published" ? "bg-green-50 text-green-700" :
                pub.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                "bg-red-50 text-red-700"
              }`}>
                {pub.status === "published" ? "Publié" : pub.status === "scheduled" ? "Programmé" : "Échec"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
