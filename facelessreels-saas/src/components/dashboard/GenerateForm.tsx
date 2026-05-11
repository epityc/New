"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NICHES,
  ELEVENLABS_VOICES,
  ART_STYLES,
  CAPTION_STYLES,
  DURATIONS,
} from "@/lib/constants";

const STEPS = ["Niche", "Voice", "Style", "Captions", "Generate"] as const;

interface FormState {
  topic: string;
  niche: string;
  voiceId: string;
  artStyle: string;
  captionStyle: string;
  duration: number;
  language: "en" | "fr";
}

const INITIAL_STATE: FormState = {
  topic: "",
  niche: "",
  voiceId: ELEVENLABS_VOICES[0].id,
  artStyle: ART_STYLES[0].id,
  captionStyle: CAPTION_STYLES[0].id,
  duration: 60,
  language: "en",
};

export function GenerateForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.niche !== "" || form.topic.trim() !== "";
    return true;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }
      const { videoId } = await res.json();
      router.push(`/dashboard/videos/${videoId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((name, i) => (
          <div key={name} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all",
                i < step
                  ? "bg-violet-600 text-white"
                  : i === step
                  ? "bg-violet-600 text-white ring-4 ring-violet-600/30"
                  : "bg-white/10 text-white/40"
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn("text-sm hidden sm:block", i === step ? "text-white font-medium" : "text-white/40")}>
              {name}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px w-8 mx-1 transition-all", i < step ? "bg-violet-600" : "bg-white/10")} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 min-h-[380px]">

        {/* STEP 0 — Niche */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-1">Choose your niche</h2>
            <p className="text-white/50 text-sm mb-6">Select a preset or describe your own topic</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {NICHES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => set("niche", n.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl border text-left text-sm transition-all",
                    form.niche === n.id
                      ? "border-violet-500 bg-violet-600/15 text-white"
                      : "border-white/8 bg-white/3 text-white/70 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <span className="text-xl">{n.icon}</span>
                  <span className="font-medium">{n.label}</span>
                </button>
              ))}
            </div>
            {(form.niche === "custom" || form.niche === "") && (
              <input
                type="text"
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
                placeholder="Or describe your own topic... e.g. 3 psychology facts about love"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500 transition-colors"
              />
            )}
            <div className="flex items-center gap-3 mt-4">
              <label className="text-sm text-white/60">Duration:</label>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => set("duration", d)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm transition-all",
                    form.duration === d
                      ? "bg-violet-600 text-white font-medium"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  )}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Voice */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-1">Language & Voice</h2>
            <p className="text-white/50 text-sm mb-6">Choose the voice style for your video</p>
            <div className="flex gap-3 mb-6">
              {(["en", "fr"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => set("language", lang)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    form.language === lang ? "bg-violet-600 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  {lang === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {ELEVENLABS_VOICES.map((v) => (
                <label
                  key={v.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                    form.voiceId === v.id
                      ? "border-violet-500 bg-violet-600/10"
                      : "border-white/8 bg-white/3 hover:border-white/20"
                  )}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={v.id}
                    checked={form.voiceId === v.id}
                    onChange={() => set("voiceId", v.id)}
                    className="accent-violet-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{v.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        v.gender === "Male" ? "bg-blue-600/20 text-blue-400" : "bg-pink-600/20 text-pink-400"
                      )}>
                        {v.gender}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{v.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Art Style */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-1">Visual Style</h2>
            <p className="text-white/50 text-sm mb-6">Choose the visual style for your background footage</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ART_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => set("artStyle", s.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm transition-all",
                    form.artStyle === s.id
                      ? "border-violet-500 bg-violet-600/15 text-white"
                      : "border-white/8 bg-white/3 text-white/70 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-medium text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — Caption Style */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-1">Caption Style</h2>
            <p className="text-white/50 text-sm mb-6">Choose how captions will appear in your video</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CAPTION_STYLES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => set("captionStyle", c.id)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all",
                    form.captionStyle === c.id
                      ? "border-violet-500 bg-violet-600/15"
                      : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <span className="text-sm font-bold">{c.label}</span>
                  <span className="text-xs text-white/40">{c.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — Summary + Generate */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-1">Ready to generate</h2>
            <p className="text-white/50 text-sm mb-6">Review your settings and generate your video</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Topic", value: form.topic || NICHES.find((n) => n.id === form.niche)?.label || "—" },
                { label: "Duration", value: `${form.duration}s` },
                { label: "Voice", value: ELEVENLABS_VOICES.find((v) => v.id === form.voiceId)?.name || "—" },
                { label: "Language", value: form.language === "en" ? "English" : "Français" },
                { label: "Visual Style", value: ART_STYLES.find((s) => s.id === form.artStyle)?.label || "—" },
                { label: "Captions", value: CAPTION_STYLES.find((c) => c.id === form.captionStyle)?.label || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-white/40 mb-1">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400">
              <span>⚡</span>
              <span>This will use <strong>1 credit</strong> from your balance.</span>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Video
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
