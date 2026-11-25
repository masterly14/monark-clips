import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SPRING} from "./tokens";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const useTime = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: frame / fps, frame, fps};
};

/** Spring 0→1 que arranca en el segundo `at`. */
export const springAt = (t: number, at: number, fps: number, config = SPRING.card) =>
  t < at ? 0 : spring({frame: (t - at) * fps, fps, config});

export const rampAt = (t: number, a: number, b: number, easing = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {...clamp, easing});
