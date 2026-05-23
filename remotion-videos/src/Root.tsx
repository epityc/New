import React from "react";
import { Composition } from "remotion";
import { ExplainerVideo } from "./compositions/ExplainerVideo";
import { SocialReel } from "./compositions/SocialReel";
import { ProductShowcase } from "./compositions/ProductShowcase";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 1 · Explainer / Motion Graphics — 24s · 1920×1080 */}
    <Composition
      id="ExplainerVideo"
      component={ExplainerVideo}
      durationInFrames={720}
      fps={30}
      width={1920}
      height={1080}
    />

    {/* 2 · Social Reel — 15s · 1080×1920 (9:16) */}
    <Composition
      id="SocialReel"
      component={SocialReel}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* 3 · Product Showcase — 20s · 1920×1080 */}
    <Composition
      id="ProductShowcase"
      component={ProductShowcase}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
