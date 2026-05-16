"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

type Model = "sora-2" | "veo-3.1" | "kling-3";
type GenerationType = "video" | "image";

const models: { value: Model; label: string; credits: number }[] = [
  { value: "sora-2", label: "Sora 2 — Vidéo longue", credits: 3 },
  { value: "veo-3.1", label: "Veo 3.1 — UGC animé", credits: 1 },
  { value: "kling-3", label: "Kling 3.0 — B-roll", credits: 2 },
];

export default function GeneratePage() {
  const [type, setType] = useState<GenerationType>("video");
  const [model, setModel] = useState<Model>("sora-2");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url?: string; status: string } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, model, prompt }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  const selectedModel = models.find((m) => m.value === model);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Générer un contenu</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="flex gap-3">
            {(["video", "image"] as GenerationType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                  type === t ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t === "video" ? "Vidéo" : "Image"}
              </button>
            ))}
          </div>
        </div>

        {/* Model (video only) */}
        {type === "video" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
            <div className="space-y-2">
              {models.map((m) => (
                <label key={m.value} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${model === m.value ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="model" value={m.value} checked={model === m.value} onChange={() => setModel(m.value)} className="accent-brand-600" />
                  <span className="text-sm flex-1">{m.label}</span>
                  <span className="text-xs text-gray-400">{m.credits} crédit{m.credits > 1 ? "s" : ""}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
          <textarea
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Ex: Une jeune femme de 25 ans tient le produit dans sa cuisine, lumière naturelle, style UGC iPhone..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !prompt}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          {loading ? "Génération en cours..." : `Générer (${type === "image" ? "0.03" : selectedModel?.credits} crédit${type === "video" && (selectedModel?.credits ?? 1) > 1 ? "s" : ""})`}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-8 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium">Résultat</span>
            <span className={`text-xs px-2 py-1 rounded-full ${result.status === "completed" ? "bg-green-50 text-green-700" : result.status === "failed" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
              {result.status === "completed" ? "Terminé" : result.status === "failed" ? "Échec" : "En cours..."}
            </span>
          </div>
          {result.url && (
            <div className="p-4">
              {type === "video" ? (
                <video src={result.url} controls className="w-full rounded-lg" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Generated" className="w-full rounded-lg" />
              )}
              <a href={result.url} download className="mt-3 inline-block text-sm text-brand-600 hover:underline">
                Télécharger
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
