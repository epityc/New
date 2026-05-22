"use client";

import { useState, useEffect } from "react";
import { Loader2, Zap, Send, Video, Check } from "lucide-react";
import { SAFE_VOICES } from "@/lib/elevenlabs";

type Step = "generate" | "voiceover" | "publish" | "done";

interface Account {
  id: string;
  platform: "tiktok" | "instagram";
  username: string;
  followers: number;
}

export default function PipelinePage() {
  const [step, setStep] = useState<Step>("generate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Generate
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<"sora-2" | "veo-3.1">("veo-3.1");
  const [videoUrl, setVideoUrl] = useState("");

  // Step 2 — Voiceover (optional)
  const [script, setScript] = useState("");
  const [voiceId, setVoiceId] = useState(SAFE_VOICES[0].id);
  const [skipVoiceover, setSkipVoiceover] = useState(false);

  // Step 3 — Publish
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [publishNow, setPublishNow] = useState(true);

  useEffect(() => {
    fetch("/api/publish").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setAccounts(data);
    });
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "video", model, prompt }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.url) return setError(data.error ?? "Génération échouée.");
    setVideoUrl(data.url);
    setStep("voiceover");
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoUrl,
        caption,
        accountIds: selectedAccounts,
        publishNow,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Publication échouée.");
    setStep("done");
  }

  function toggleAccount(id: string) {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Pipeline complet</h1>
      <p className="text-gray-500 text-sm mb-8">Arcads génère → voix off ElevenLabs → publication TikTok/Instagram</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {(["generate", "voiceover", "publish"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? "bg-brand-600 text-white" : (["voiceover", "publish", "done"].indexOf(step) > i || step === "done") ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
              {(["voiceover", "publish", "done"].indexOf(step) > i || step === "done") ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs ${step === s ? "text-gray-900 font-medium" : "text-gray-400"}`}>
              {s === "generate" ? "Générer" : s === "voiceover" ? "Voix off" : "Publier"}
            </span>
            {i < 2 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === "generate" && (
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modèle vidéo</label>
            <div className="flex gap-3">
              {(["veo-3.1", "sora-2"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setModel(m)} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${model === m ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 text-gray-600"}`}>
                  {m === "veo-3.1" ? "Veo 3.1 — UGC" : "Sora 2 — Long"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Décris ta vidéo</label>
            <textarea required value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4}
              placeholder="Ex: Une femme de 25 ans tient le produit dans sa cuisine, style UGC selfie iPhone..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading || !prompt} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
            {loading ? "Génération en cours..." : "Générer la vidéo"}
          </button>
        </form>
      )}

      {/* Step 2 — Voiceover */}
      {step === "voiceover" && (
        <div className="space-y-5">
          {videoUrl && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <video src={videoUrl} controls className="w-full" />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={skipVoiceover} onChange={(e) => setSkipVoiceover(e.target.checked)} className="accent-brand-600" />
            <span className="text-sm text-gray-600">Passer la voix off (publier la vidéo telle quelle)</span>
          </label>
          {!skipVoiceover && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voix</label>
                <div className="grid grid-cols-2 gap-2">
                  {SAFE_VOICES.map((v) => (
                    <label key={v.id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${voiceId === v.id ? "border-brand-500 bg-brand-50" : "border-gray-200"}`}>
                      <input type="radio" value={v.id} checked={voiceId === v.id} onChange={() => setVoiceId(v.id)} className="accent-brand-600" />
                      <span><strong>{v.name}</strong> — {v.style}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Script (75–80 mots pour 30s)</label>
                <textarea value={script} onChange={(e) => setScript(e.target.value)} rows={5}
                  placeholder="Ex: J'ai essayé ce produit pendant 30 jours et voilà ce qui s'est passé..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
            </>
          )}
          <button onClick={() => setStep("publish")} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700">
            <Zap size={16} />
            Continuer vers la publication
          </button>
        </div>
      )}

      {/* Step 3 — Publish */}
      {step === "publish" && (
        <form onSubmit={handlePublish} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comptes</label>
            {accounts.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun compte connecté. Connecte TikTok/Instagram sur <a href="https://dansugc.com/dashboard" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">dansugc.com</a>.</p>
            ) : (
              <div className="space-y-2">
                {accounts.map((acc) => (
                  <label key={acc.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedAccounts.includes(acc.id) ? "border-brand-500 bg-brand-50" : "border-gray-200"}`}>
                    <input type="checkbox" checked={selectedAccounts.includes(acc.id)} onChange={() => toggleAccount(acc.id)} className="accent-brand-600" />
                    <span className="text-sm capitalize font-medium">{acc.platform}</span>
                    <span className="text-sm text-gray-600">@{acc.username}</span>
                    <span className="text-xs text-gray-400 ml-auto">{acc.followers?.toLocaleString()} abonnés</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
            <textarea required value={caption} onChange={(e) => setCaption(e.target.value)} rows={3}
              placeholder="Texte de la publication + #hashtags..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} className="accent-brand-600" />
            <span className="text-sm text-gray-600">Publier maintenant</span>
          </label>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading || !selectedAccounts.length || !caption} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? "Publication..." : publishNow ? "Publier maintenant" : "Programmer"}
          </button>
        </form>
      )}

      {/* Done */}
      {step === "done" && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Vidéo publiée !</h2>
          <p className="text-gray-500 text-sm mb-6">Ta vidéo est en cours de publication sur tes réseaux.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => { setStep("generate"); setVideoUrl(""); setPrompt(""); setCaption(""); setSelectedAccounts([]); }}
              className="border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm hover:border-gray-300">
              Créer une autre vidéo
            </button>
            <a href="/social" className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-brand-700">
              Voir mes publications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
