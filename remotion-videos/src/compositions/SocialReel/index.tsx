import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../lib/theme";
import { fadeIn, fadeOut, slideY, scaleSpring, stagger, sweep } from "../../lib/animations";

// ─── Customise these ────────────────────────────────────────────────────────
const HOOK_LINE1 = "Stop wasting";
const HOOK_LINE2 = "time.";

const POINTS = [
  { number: "01", headline: "Automate everything.", sub: "Let the machine work while you sleep." },
  { number: "02", headline: "Ship 10x faster.", sub: "From idea to production in hours, not weeks." },
  { number: "03", headline: "Grow without limits.", sub: "Infrastructure that scales infinitely." },
];

const CTA_LINE1 = "Try it free";
const CTA_LINE2 = "No credit card required →";
const BRAND = "YOUR BRAND";
// ────────────────────────────────────────────────────────────────────────────

const F = {
  hookIn: 0,
  pointsIn: 90,
  ctaIn: 330,
  total: 450,
};

export const SocialReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalFadeOut = fadeOut(frame, F.total - 20, 20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        opacity: 1 - globalFadeOut,
      }}
    >
      {/* Ambient vertical gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            rgba(201,168,76,0.08) 0%,
            transparent 35%,
            transparent 65%,
            rgba(201,168,76,0.05) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Subtle dot pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Top brand bar */}
      <TopBar frame={frame} fps={fps} />

      {/* Hook */}
      {frame < F.pointsIn + 30 && (
        <HookSection frame={frame} fps={fps} />
      )}

      {/* Points */}
      {frame >= F.pointsIn && frame < F.ctaIn + 30 && (
        <PointsSection frame={frame} fps={fps} />
      )}

      {/* CTA */}
      {frame >= F.ctaIn && (
        <CTASection frame={frame} fps={fps} />
      )}

      {/* Bottom progress bar */}
      <ProgressBar frame={frame} total={F.total} />
    </AbsoluteFill>
  );
};

const TopBar: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = fadeIn(frame, 0, 20);
  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 2,
            background: theme.colors.gold,
          }}
        />
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase" as const,
            color: theme.colors.gold,
          }}
        >
          {BRAND}
        </span>
        <div
          style={{
            width: 32,
            height: 2,
            background: theme.colors.gold,
          }}
        />
      </div>
    </div>
  );
};

const HookSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const fadeOutStart = F.pointsIn - 20;
  const sectionOpacity =
    frame >= fadeOutStart ? fadeOut(frame, fadeOutStart, 20) : 1;

  const line1Opacity = fadeIn(frame, 0, 20);
  const line1Y = slideY(frame, 0, fps, 80);

  const line2Opacity = fadeIn(frame, 14, 20);
  const line2Y = slideY(frame, 14, fps, 80);

  const subOpacity = fadeIn(frame, 35, 22);
  const subY = slideY(frame, 35, fps, 40);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 160,
        opacity: sectionOpacity,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 108,
          fontWeight: 700,
          color: theme.colors.white,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
        }}
      >
        {HOOK_LINE1}
      </div>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 108,
          fontWeight: 700,
          color: theme.colors.gold,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
        }}
      >
        {HOOK_LINE2}
      </div>

      <div
        style={{
          marginTop: 48,
          width: 60,
          height: 3,
          background: `linear-gradient(90deg, ${theme.colors.gold}, transparent)`,
          opacity: fadeIn(frame, 28, 20),
        }}
      />

      <div
        style={{
          marginTop: 36,
          fontFamily: theme.fonts.body,
          fontSize: 26,
          fontWeight: 300,
          color: theme.colors.gray,
          lineHeight: 1.5,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        There's a better way.
        <br />
        Let us show you.
      </div>
    </AbsoluteFill>
  );
};

const PointsSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - F.pointsIn;
  const fadeOutStart = F.ctaIn - F.pointsIn - 20;
  const sectionOpacity =
    relFrame >= fadeOutStart ? fadeOut(relFrame, fadeOutStart, 20) : 1;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 80,
        paddingRight: 80,
        gap: 0,
        opacity: sectionOpacity,
      }}
    >
      {POINTS.map((p, i) => {
        const delay = stagger(i, 18);
        const itemOpacity = fadeIn(relFrame, delay, 20);
        const itemY = slideY(relFrame, delay, fps, 60);
        const numOpacity = fadeIn(relFrame, delay, 15);

        return (
          <div
            key={i}
            style={{
              opacity: itemOpacity,
              transform: `translateY(${itemY}px)`,
              paddingTop: i === 0 ? 0 : 52,
              paddingBottom: 52,
              borderBottom:
                i < POINTS.length - 1
                  ? `1px solid ${theme.colors.lineSubtle}`
                  : "none",
              display: "flex",
              gap: 36,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: theme.colors.goldDim,
                marginTop: 10,
                opacity: numOpacity,
                flexShrink: 0,
              }}
            >
              {p.number}
            </div>
            <div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 52,
                  fontWeight: 700,
                  color: theme.colors.white,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                  marginBottom: 14,
                }}
              >
                {p.headline}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 22,
                  fontWeight: 300,
                  color: theme.colors.gray,
                  lineHeight: 1.5,
                }}
              >
                {p.sub}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CTASection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - F.ctaIn;
  const ctaOpacity = fadeIn(relFrame, 0, 25);
  const ctaY = slideY(relFrame, 0, fps, 60);
  const btnOpacity = fadeIn(relFrame, 20, 25);
  const btnScale = scaleSpring(relFrame, 20, fps, 0.88, 1, {
    damping: 13,
    stiffness: 130,
  });

  // CTA glow pulse
  const pulse = 0.6 + Math.sin(((relFrame - 20) / 28) * Math.PI) * 0.4;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 160,
      }}
    >
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 84,
            fontWeight: 700,
            color: theme.colors.white,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Your next
          <br />
          <span style={{ color: theme.colors.gold }}>move</span> starts
          <br />
          today.
        </div>
      </div>

      <div
        style={{
          marginTop: 64,
          opacity: btnOpacity,
          transform: `scale(${btnScale})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.colors.gold} 0%, ${theme.colors.goldLight} 100%)`,
            borderRadius: 60,
            padding: "26px 60px",
            display: "inline-block",
            boxShadow: `0 0 ${50 * pulse}px rgba(201,168,76,${0.45 * pulse})`,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 22,
              fontWeight: 700,
              color: "#080808",
              letterSpacing: "0.04em",
            }}
          >
            {CTA_LINE1}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          opacity: fadeIn(relFrame, 35, 20),
          fontFamily: theme.fonts.body,
          fontSize: 18,
          fontWeight: 400,
          color: theme.colors.goldDim,
          letterSpacing: "0.04em",
        }}
      >
        {CTA_LINE2}
      </div>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC<{ frame: number; total: number }> = ({
  frame,
  total,
}) => {
  const progress = frame / total;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 80,
        right: 80,
        height: 2,
        background: theme.colors.lineSubtle,
        borderRadius: 2,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${theme.colors.gold}, ${theme.colors.goldLight})`,
          borderRadius: 2,
          boxShadow: `0 0 8px ${theme.colors.goldDim}`,
        }}
      />
    </div>
  );
};
