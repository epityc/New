import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../lib/theme";
import {
  fadeIn,
  fadeOut,
  slideY,
  scaleSpring,
  stagger,
  countUp,
  sweep,
} from "../../lib/animations";

// ─── Customise these ────────────────────────────────────────────────────────
const BRAND = "YOUR BRAND";
const HEADLINE_LINE1 = "Build Something";
const HEADLINE_LINE2 = "That Matters.";
const SUBHEADLINE = "A powerful platform designed to accelerate your vision.";

const FEATURES = [
  { icon: "⚡", title: "Lightning Fast", body: "Deploy in seconds, not hours. Our infrastructure handles the heavy lifting so you can focus on what counts." },
  { icon: "🎯", title: "Pixel Precision", body: "Every detail crafted with obsessive care. From micro-animations to macro-architecture, nothing is left to chance." },
  { icon: "∞", title: "Infinite Scale", body: "Built to grow with you from Day 1 to IPO. No infrastructure rewrites, no painful migrations." },
];

const STATS = [
  { value: 99, suffix: ".9%", label: "Uptime SLA" },
  { value: 10, suffix: "x", label: "Faster Deploys" },
  { value: 0, suffix: "$", label: "Setup Cost", prefix: "$" },
];

const CTA_TEXT = "Start Building — It's Free";
// ────────────────────────────────────────────────────────────────────────────

// Frame markers
const F = {
  lineIn: 0,
  brandIn: 30,
  headlineIn: 70,
  subIn: 150,
  featuresIn: 230,
  statsIn: 430,
  ctaIn: 560,
  total: 720,
};

export const ExplainerVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgGlow = sweep(frame, 0, 90);
  const globalFadeOut = fadeOut(frame, F.total - 30, 30);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        opacity: 1 - globalFadeOut,
      }}
    >
      {/* Ambient radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%,
            rgba(201,168,76,${bgGlow * 0.07}) 0%,
            transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Grid overlay for depth */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
          pointerEvents: "none",
        }}
      />

      {/* ── Scene 1 · Brand reveal ── */}
      <GoldLine frame={frame} start={F.lineIn} />
      <BrandBadge frame={frame} fps={fps} start={F.brandIn} />

      {/* ── Scene 2 · Hero headline ── */}
      {frame >= F.headlineIn && frame < F.featuresIn + 60 && (
        <HeroHeadline
          frame={frame}
          fps={fps}
          start={F.headlineIn}
          subStart={F.subIn}
        />
      )}

      {/* ── Scene 3 · Feature cards ── */}
      {frame >= F.featuresIn && frame < F.statsIn + 60 && (
        <FeaturesSection frame={frame} fps={fps} start={F.featuresIn} />
      )}

      {/* ── Scene 4 · Stats ── */}
      {frame >= F.statsIn && frame < F.ctaIn + 60 && (
        <StatsSection frame={frame} fps={fps} start={F.statsIn} />
      )}

      {/* ── Scene 5 · CTA ── */}
      {frame >= F.ctaIn && (
        <CTASection frame={frame} fps={fps} start={F.ctaIn} />
      )}
    </AbsoluteFill>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const GoldLine: React.FC<{ frame: number; start: number }> = ({
  frame,
  start,
}) => {
  const progress = sweep(frame, start, 40);
  return (
    <div
      style={{
        position: "absolute",
        top: 108,
        left: 120,
        right: 120,
        height: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          background: `linear-gradient(90deg, ${theme.colors.gold} 0%, ${theme.colors.goldLight} 50%, ${theme.colors.gold} 100%)`,
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

const BrandBadge: React.FC<{ frame: number; fps: number; start: number }> = ({
  frame,
  fps,
  start,
}) => {
  const opacity = fadeIn(frame, start, 25);
  const y = slideY(frame, start, fps, 20);
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 120,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color: theme.colors.gold,
        }}
      >
        {BRAND}
      </span>
    </div>
  );
};

const HeroHeadline: React.FC<{
  frame: number;
  fps: number;
  start: number;
  subStart: number;
}> = ({ frame, fps, start, subStart }) => {
  const line1Opacity = fadeIn(frame, start, 20);
  const line1Y = slideY(frame, start, fps, 60);

  const line2Opacity = fadeIn(frame, start + 18, 20);
  const line2Y = slideY(frame, start + 18, fps, 60);

  const subOpacity = fadeIn(frame, subStart, 25);
  const subY = slideY(frame, subStart, fps, 30);

  // Fade out as features come in
  const sectionFade =
    frame > start + 120
      ? fadeOut(frame, start + 150, 30)
      : 0;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 160,
        opacity: 1 - sectionFade,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 1100 }}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 112,
            fontWeight: 700,
            color: theme.colors.white,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          {HEADLINE_LINE1}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 112,
            fontWeight: 700,
            color: theme.colors.gold,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
          }}
        >
          {HEADLINE_LINE2}
        </div>
        <div
          style={{
            marginTop: 36,
            fontFamily: theme.fonts.body,
            fontSize: 26,
            fontWeight: 300,
            color: theme.colors.gray,
            letterSpacing: "0.01em",
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          {SUBHEADLINE}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FeaturesSection: React.FC<{
  frame: number;
  fps: number;
  start: number;
}> = ({ frame, fps, start }) => {
  const sectionOpacity =
    frame > start + 180 ? fadeOut(frame, start + 180, 25) : 1;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: sectionOpacity,
      }}
    >
      {/* Section label */}
      <div
        style={{
          marginBottom: 60,
          opacity: fadeIn(frame, start, 20),
          fontFamily: theme.fonts.body,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
          color: theme.colors.gold,
        }}
      >
        Core Capabilities
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          gap: 40,
          paddingLeft: 120,
          paddingRight: 120,
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      >
        {FEATURES.map((f, i) => {
          const delay = stagger(i, 14);
          const cardOpacity = fadeIn(frame, start + delay, 20);
          const cardY = slideY(frame, start + delay, fps, 70);
          const cardScale = scaleSpring(frame, start + delay, fps, 0.88, 1);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: theme.colors.bgCard,
                border: `1px solid ${theme.colors.line}`,
                borderRadius: 16,
                padding: "48px 44px",
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                boxShadow: `0 0 60px rgba(201,168,76,0.06), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 28 }}>{f.icon}</div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 28,
                  fontWeight: 700,
                  color: theme.colors.white,
                  marginBottom: 18,
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 18,
                  fontWeight: 300,
                  color: theme.colors.gray,
                  lineHeight: 1.7,
                }}
              >
                {f.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const StatsSection: React.FC<{
  frame: number;
  fps: number;
  start: number;
}> = ({ frame, fps, start }) => {
  const sectionOpacity =
    frame > start + 90 ? fadeOut(frame, start + 90, 30) : 1;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: sectionOpacity,
      }}
    >
      <div
        style={{
          opacity: fadeIn(frame, start, 20),
          fontFamily: theme.fonts.body,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase" as const,
          color: theme.colors.gold,
          marginBottom: 64,
        }}
      >
        By the Numbers
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          alignItems: "center",
        }}
      >
        {STATS.map((s, i) => {
          const delay = stagger(i, 16);
          const numOpacity = fadeIn(frame, start + delay, 20);
          const numY = slideY(frame, start + delay, fps, 50);
          const counted = countUp(frame, start + delay + 10, 50, s.value);

          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 100,
                    background: theme.colors.line,
                    margin: "0 80px",
                    opacity: fadeIn(frame, start, 30),
                  }}
                />
              )}
              <div
                style={{
                  textAlign: "center",
                  opacity: numOpacity,
                  transform: `translateY(${numY}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 96,
                    fontWeight: 700,
                    color: theme.colors.gold,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.prefix || ""}
                  {counted}
                  {s.suffix}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: theme.fonts.body,
                    fontSize: 16,
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: theme.colors.gray,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CTASection: React.FC<{
  frame: number;
  fps: number;
  start: number;
}> = ({ frame, fps, start }) => {
  const overlineOpacity = fadeIn(frame, start, 20);
  const headlineOpacity = fadeIn(frame, start + 15, 25);
  const headlineY = slideY(frame, start + 15, fps, 50);
  const ctaOpacity = fadeIn(frame, start + 40, 25);
  const ctaScale = scaleSpring(frame, start + 40, fps, 0.9, 1, {
    damping: 14,
    stiffness: 120,
  });

  // Pulsing glow on CTA button
  const pulse = Math.sin(((frame - start - 40) / 30) * Math.PI) * 0.4 + 0.6;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Top gold line */}
      <div
        style={{
          width: 60,
          height: 2,
          background: theme.colors.gold,
          marginBottom: 36,
          opacity: overlineOpacity,
        }}
      />

      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 82,
          fontWeight: 700,
          color: theme.colors.white,
          letterSpacing: "-0.02em",
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: 900,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        Ready to begin?
      </div>

      <div
        style={{
          marginTop: 24,
          fontFamily: theme.fonts.body,
          fontSize: 22,
          fontWeight: 300,
          color: theme.colors.gray,
          opacity: fadeIn(frame, start + 25, 25),
        }}
      >
        Join thousands of teams already building with us.
      </div>

      <div
        style={{
          marginTop: 56,
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.colors.gold} 0%, ${theme.colors.goldLight} 100%)`,
            borderRadius: 60,
            padding: "22px 56px",
            fontFamily: theme.fonts.body,
            fontSize: 18,
            fontWeight: 600,
            color: "#080808",
            letterSpacing: "0.04em",
            boxShadow: `0 0 ${40 * pulse}px rgba(201,168,76,${0.5 * pulse}), 0 4px 24px rgba(0,0,0,0.4)`,
          }}
        >
          {CTA_TEXT}
        </div>
      </div>

      {/* Bottom brand line */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: fadeIn(frame, start + 55, 25),
          fontFamily: theme.fonts.body,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color: theme.colors.grayDim,
        }}
      >
        {BRAND}
      </div>
    </AbsoluteFill>
  );
};
