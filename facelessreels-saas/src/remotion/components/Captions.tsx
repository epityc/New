import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import type { WordTimestamp } from "../types";

// ── Style definitions ────────────────────────────────────────────────────────

interface StyleDef {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle?: string;
  color: string;
  textTransform?: CSSProperties["textTransform"];
  textShadow?: string;
  webkitTextStroke?: string;
  letterSpacing?: number;
  activeColor: string;
  activeBg?: string;
  activeBorderRadius?: number;
  activePadding?: string;
}

const STYLES: Record<string, StyleDef> = {
  bold_stroke: {
    fontFamily: "'Arial Black', 'Impact', sans-serif",
    fontSize: 80,
    fontWeight: 900,
    textTransform: "uppercase",
    color: "#FFFFFF",
    webkitTextStroke: "5px #000000",
    textShadow: "0 4px 14px rgba(0,0,0,0.6)",
    activeColor: "#FFFFFF",
  },
  red_highlight: {
    fontFamily: "'Arial Black', 'Impact', sans-serif",
    fontSize: 76,
    fontWeight: 900,
    textTransform: "uppercase",
    color: "#FFFFFF",
    textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
    activeColor: "#FFFFFF",
    activeBg: "#E53535",
    activeBorderRadius: 8,
    activePadding: "4px 12px",
  },
  sleek: {
    fontFamily: "'Arial', sans-serif",
    fontSize: 66,
    fontWeight: 700,
    color: "rgba(255,255,255,0.92)",
    textShadow: "0 2px 12px rgba(0,0,0,0.75)",
    activeColor: "#FFFFFF",
    activeBg: "rgba(255,255,255,0.18)",
    activeBorderRadius: 6,
    activePadding: "2px 10px",
  },
  majestic: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontSize: 72,
    fontWeight: 700,
    fontStyle: "italic",
    color: "#FFD700",
    textShadow: "0 0 40px rgba(255,215,0,0.4), 0 2px 10px rgba(0,0,0,0.9)",
    activeColor: "#FFF8C0",
    letterSpacing: 2,
  },
  beast: {
    fontFamily: "'Arial Black', 'Impact', sans-serif",
    fontSize: 84,
    fontWeight: 900,
    textTransform: "uppercase",
    color: "#FFE500",
    webkitTextStroke: "4px #000000",
    textShadow: "0 4px 20px rgba(0,0,0,0.9)",
    activeColor: "#000000",
    activeBg: "#FFE500",
    activeBorderRadius: 10,
    activePadding: "4px 14px",
  },
  elegant: {
    fontFamily: "'Georgia', serif",
    fontSize: 60,
    fontWeight: 400,
    fontStyle: "italic",
    color: "#FFFFFF",
    textShadow: "2px 2px 24px rgba(0,0,0,0.95)",
    letterSpacing: 1,
    activeColor: "#E8D5FF",
  },
  pixel: {
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    fontSize: 62,
    fontWeight: 900,
    textTransform: "uppercase",
    color: "#00FF41",
    textShadow: "0 0 12px #00FF41, 0 0 24px rgba(0,255,65,0.4)",
    activeColor: "#000000",
    activeBg: "#00FF41",
    activeBorderRadius: 0,
    activePadding: "2px 8px",
  },
  clarity: {
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    fontSize: 70,
    fontWeight: 700,
    color: "#FFFFFF",
    textShadow: "0 2px 24px rgba(0,0,0,0.85), 0 0 50px rgba(0,0,0,0.4)",
    activeColor: "#FFFFFF",
  },
};

// ── Word chunking ────────────────────────────────────────────────────────────

function chunkWords(words: WordTimestamp[], size = 3): WordTimestamp[][] {
  const chunks: WordTimestamp[][] = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size));
  }
  return chunks;
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  wordTimestamps: WordTimestamp[];
  captionStyle: string;
  fps: number;
}

export const Captions: React.FC<Props> = ({ wordTimestamps, captionStyle, fps }) => {
  const frame = useCurrentFrame();
  const currentSec = frame / fps;
  const style = STYLES[captionStyle] ?? STYLES.bold_stroke;

  if (wordTimestamps.length === 0) return null;

  const chunks = chunkWords(wordTimestamps, 3);

  // Find which chunk should be active right now
  const activeIndex = chunks.findIndex((chunk) => {
    const start = chunk[0].start;
    const end = chunk[chunk.length - 1].end + 0.25; // 250ms hold after last word
    return currentSec >= start && currentSec <= end;
  });

  if (activeIndex === -1) return null;

  const chunk = chunks[activeIndex];
  const chunkStartFrame = chunk[0].start * fps;

  // Entrance animation: first 10 frames → scale + fade in
  const enterT = interpolate(frame - chunkStartFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(enterT, [0, 1], [0.82, 1]);
  const opacity = enterT;
  const translateY = interpolate(enterT, [0, 1], [28, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 180,
        paddingLeft: 48,
        paddingRight: 48,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        {chunk.map((w, i) => {
          const isActive = currentSec >= w.start && currentSec <= w.end + 0.05;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                fontStyle: style.fontStyle ?? "normal",
                color: isActive ? style.activeColor : style.color,
                textTransform: style.textTransform ?? "none",
                WebkitTextStroke: style.webkitTextStroke,
                textShadow: style.textShadow,
                letterSpacing: style.letterSpacing ?? 0,
                backgroundColor: isActive && style.activeBg ? style.activeBg : "transparent",
                borderRadius: isActive && style.activeBorderRadius ? style.activeBorderRadius : 0,
                padding: isActive && style.activePadding ? style.activePadding : "0 4px",
                transform: isActive ? "scale(1.08)" : "scale(1)",
                lineHeight: 1.15,
              }}
            >
              {style.textTransform === "uppercase" ? w.word.toUpperCase() : w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
