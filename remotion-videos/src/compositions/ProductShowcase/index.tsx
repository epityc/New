import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { theme } from "../../lib/theme";
import {
  fadeIn,
  fadeOut,
  slideY,
  slideX,
  scaleSpring,
  stagger,
  sweep,
  countUp,
} from "../../lib/animations";

// ─── Customise these ────────────────────────────────────────────────────────
const PRODUCT_NAME = "PRODUCT NAME";
const TAGLINE = "Engineered for excellence.";
const PRODUCT_IMAGE: string | null = null; // set to staticFile("product.png") after placing in public/

const FEATURES = [
  { icon: "◈", label: "Premium Materials", detail: "Crafted from aerospace-grade components" },
  { icon: "◉", label: "10-Year Warranty", detail: "Built to outlast everything else" },
  { icon: "◎", label: "Global Shipping", detail: "Delivered to your door in 48 hours" },
];

const PRICE = "299";
const CURRENCY = "$";
const CTA = "Order Now";
const BRAND = "YOUR BRAND";
// ────────────────────────────────────────────────────────────────────────────

const F = {
  revealIn: 0,
  productIn: 50,
  taglineIn: 110,
  featuresIn: 210,
  priceIn: 390,
  total: 600,
};

export const ProductShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalFadeOut = fadeOut(frame, F.total - 25, 25);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        opacity: 1 - globalFadeOut,
      }}
    >
      {/* Deep radial spotlight */}
      <SpotlightBg frame={frame} fps={fps} />

      {/* Grid lines */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Left column: product visual */}
      <ProductVisual frame={frame} fps={fps} />

      {/* Right column: content */}
      <ContentPanel frame={frame} fps={fps} />

      {/* Brand watermark */}
      <BrandMark frame={frame} />
    </AbsoluteFill>
  );
};

const SpotlightBg: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  const intensity = sweep(frame, 0, 80);
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse 55% 70% at 35% 50%,
            rgba(201,168,76,${intensity * 0.1}) 0%,
            rgba(201,168,76,${intensity * 0.03}) 40%,
            transparent 70%)
        `,
        pointerEvents: "none",
      }}
    />
  );
};

const ProductVisual: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const imgOpacity = fadeIn(frame, F.productIn, 35);
  const imgScale = scaleSpring(frame, F.productIn, fps, 0.75, 1, {
    damping: 16,
    stiffness: 70,
    mass: 1.2,
  });

  // Glow intensity breathes over time
  const glowBreath =
    0.7 +
    (frame > F.productIn + 30
      ? Math.sin(((frame - F.productIn - 30) / 45) * Math.PI * 2) * 0.3
      : 0);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "50%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,${glowBreath * 0.12}) 0%, transparent 70%)`,
          opacity: imgOpacity,
        }}
      />

      {/* Inner glow ring */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: `1px solid rgba(201,168,76,${glowBreath * 0.25})`,
          boxShadow: `0 0 80px rgba(201,168,76,${glowBreath * 0.1}), inset 0 0 80px rgba(201,168,76,${glowBreath * 0.05})`,
          opacity: imgOpacity,
        }}
      />

      {/* Product image or placeholder */}
      <div
        style={{
          width: 380,
          height: 380,
          borderRadius: 24,
          overflow: "hidden",
          opacity: imgOpacity,
          transform: `scale(${imgScale})`,
          boxShadow: `
            0 0 120px rgba(201,168,76,${glowBreath * 0.25}),
            0 40px 80px rgba(0,0,0,0.6)
          `,
          position: "relative",
          zIndex: 1,
        }}
      >
        {PRODUCT_IMAGE ? (
          <Img
            src={PRODUCT_IMAGE}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ProductPlaceholder glowBreath={glowBreath} />
        )}
      </div>
    </div>
  );
};

const ProductPlaceholder: React.FC<{ glowBreath: number }> = ({
  glowBreath,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: `linear-gradient(135deg, #111111 0%, #1a1a1a 100%)`,
      border: `1px solid rgba(201,168,76,0.2)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        fontSize: 72,
        opacity: 0.25,
        filter: `drop-shadow(0 0 20px rgba(201,168,76,${glowBreath * 0.8}))`,
      }}
    >
      ◈
    </div>
    <div
      style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: "rgba(201,168,76,0.4)",
      }}
    >
      Place product image in
      <br />
      public/product.png
    </div>
  </div>
);

const ContentPanel: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const nameOpacity = fadeIn(frame, F.productIn + 10, 25);
  const nameY = slideY(frame, F.productIn + 10, fps, 50);

  const taglineOpacity = fadeIn(frame, F.taglineIn, 25);
  const taglineY = slideY(frame, F.taglineIn, fps, 40);

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 80,
        paddingRight: 120,
        boxSizing: "border-box" as const,
      }}
    >
      {/* Overline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
          opacity: fadeIn(frame, F.productIn, 20),
        }}
      >
        <div
          style={{
            width: 32,
            height: 1,
            background: theme.colors.gold,
          }}
        />
        <span
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: theme.colors.gold,
          }}
        >
          New Collection
        </span>
      </div>

      {/* Product name */}
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 76,
          fontWeight: 700,
          color: theme.colors.white,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          marginBottom: 24,
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
        }}
      >
        {PRODUCT_NAME}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 22,
          fontWeight: 300,
          color: theme.colors.gray,
          letterSpacing: "0.04em",
          marginBottom: 56,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        {TAGLINE}
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: theme.colors.line,
          marginBottom: 48,
          opacity: fadeIn(frame, F.featuresIn - 20, 20),
        }}
      />

      {/* Features list */}
      <FeaturesList frame={frame} fps={fps} />

      {/* Price + CTA */}
      {frame >= F.priceIn && (
        <PriceBlock frame={frame} fps={fps} />
      )}
    </div>
  );
};

const FeaturesList: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 48 }}>
    {FEATURES.map((f, i) => {
      const delay = stagger(i, 14);
      const opacity = fadeIn(frame, F.featuresIn + delay, 20);
      const x = slideX(frame, F.featuresIn + delay, fps, -40);

      return (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            opacity,
            transform: `translateX(${x}px)`,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: theme.colors.gold,
              marginTop: 2,
              flexShrink: 0,
              width: 28,
              textAlign: "center",
            }}
          >
            {f.icon}
          </div>
          <div>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 18,
                fontWeight: 600,
                color: theme.colors.offWhite,
                letterSpacing: "0.01em",
                marginBottom: 6,
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 15,
                fontWeight: 300,
                color: theme.colors.gray,
              }}
            >
              {f.detail}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const PriceBlock: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - F.priceIn;
  const blockOpacity = fadeIn(relFrame, 0, 25);
  const blockY = slideY(relFrame, 0, fps, 40);
  const btnOpacity = fadeIn(relFrame, 20, 25);
  const btnScale = scaleSpring(relFrame, 20, fps, 0.88, 1, {
    damping: 13,
    stiffness: 130,
  });

  const pulse = 0.55 + Math.sin(((relFrame - 20) / 32) * Math.PI) * 0.45;

  return (
    <div
      style={{
        opacity: blockOpacity,
        transform: `translateY(${blockY}px)`,
      }}
    >
      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: theme.colors.line,
          marginBottom: 40,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
        }}
      >
        {/* Price */}
        <div>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: theme.colors.gray,
              marginBottom: 8,
            }}
          >
            Starting from
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 28,
                fontWeight: 300,
                color: theme.colors.gold,
              }}
            >
              {CURRENCY}
            </span>
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 64,
                fontWeight: 700,
                color: theme.colors.white,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {PRICE}
            </span>
          </div>
        </div>

        {/* CTA button */}
        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.gold} 0%, ${theme.colors.goldLight} 100%)`,
              borderRadius: 60,
              padding: "20px 48px",
              fontFamily: theme.fonts.body,
              fontSize: 17,
              fontWeight: 700,
              color: "#080808",
              letterSpacing: "0.05em",
              boxShadow: `
                0 0 ${48 * pulse}px rgba(201,168,76,${0.4 * pulse}),
                0 8px 32px rgba(0,0,0,0.4)
              `,
              cursor: "default",
            }}
          >
            {CTA}
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandMark: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      bottom: 48,
      right: 120,
      opacity: fadeIn(frame, 30, 30) * 0.4,
      fontFamily: '"Inter", sans-serif',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.28em",
      textTransform: "uppercase" as const,
      color: theme.colors.gold,
    }}
  >
    {BRAND}
  </div>
);
