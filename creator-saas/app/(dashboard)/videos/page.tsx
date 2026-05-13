import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mes générations</h1>
        <Link href="/generate" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
          + Nouveau
        </Link>
      </div>

      {!generations || generations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-4">Aucune génération pour l&apos;instant.</p>
          <Link href="/generate" className="text-brand-600 hover:underline text-sm">Générer maintenant →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {generations.map((gen) => (
            <div key={gen.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {gen.output_url && gen.type === "video" ? (
                <video src={gen.output_url} className="w-full aspect-video object-cover" controls />
              ) : gen.output_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={gen.output_url} alt={gen.prompt} className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video bg-gray-50 flex items-center justify-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${gen.status === "failed" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"}`}>
                    {gen.status === "failed" ? "Échec" : "En cours..."}
                  </span>
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate mb-1">{gen.prompt}</p>
                <p className="text-xs text-gray-400">{new Date(gen.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
