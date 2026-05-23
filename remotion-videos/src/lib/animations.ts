import { interpolate, spring, SpringConfig } from "remotion";

export const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value));

export const fadeIn = (frame: number, start: number, duration = 20): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const fadeOut = (frame: number, start: number, duration = 15): number =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const slideY = (
  frame: number,
  start: number,
  fps: number,
  amount = 50,
  config: Partial<SpringConfig> = { damping: 22, stiffness: 90, mass: 1 }
): number => {
  const p = spring({ frame: frame - start, fps, config });
  return interpolate(p, [0, 1], [amount, 0]);
};

export const slideX = (
  frame: number,
  start: number,
  fps: number,
  amount = 80,
  config: Partial<SpringConfig> = { damping: 22, stiffness: 80, mass: 1 }
): number => {
  const p = spring({ frame: frame - start, fps, config });
  return interpolate(p, [0, 1], [amount, 0]);
};

export const scaleSpring = (
  frame: number,
  start: number,
  fps: number,
  from = 0.82,
  to = 1,
  config: Partial<SpringConfig> = { damping: 18, stiffness: 110, mass: 1 }
): number => {
  const p = spring({ frame: frame - start, fps, config });
  return interpolate(p, [0, 1], [from, to]);
};

export const stagger = (index: number, delayPerItem = 8): number =>
  index * delayPerItem;

// Counts from 0 to target over a duration
export const countUp = (
  frame: number,
  start: number,
  duration: number,
  target: number
): number => {
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(p * target);
};

// Linear sweep from 0 to 1 over a duration
export const sweep = (frame: number, start: number, duration: number): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
