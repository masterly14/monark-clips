import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Easing, staticFile} from "remotion";
import {useTime} from "../kit";
import {motion, palette} from "./graphics";
import {ShotContent} from "./Shots";
import {AUDIO, sequence, type Shot} from "./timeline";

const bridges: Partial<Record<Shot, {x: number; y: number; frames: number}>> = {
  scan: {x: 532, y: 1414, frames: 17},
  permit: {x: 305, y: 820, frames: 13},
  phone: {x: 855, y: 956, frames: 15},
  goodbye: {x: 799, y: 788, frames: 12},
};

export const AlexPasaporteV2: React.FC = () => {
  const {t, fps} = useTime();
  const next = sequence.findIndex(([, start]) => t < start);
  const index = next === -1 ? sequence.length - 1 : next - 1;
  const [shot, start] = sequence[index];
  const bridge = bridges[shot];
  const outgoing = sequence[index - 1]?.[0];
  const revealing = bridge && outgoing && t < start + bridge.frames / fps;
  const radius = bridge ? Math.max(15, motion(t, start, bridge.frames / fps, Easing.inOut(Easing.cubic)) * 2035) : 0;

  return <AbsoluteFill style={{background: palette.paper, overflow: "hidden"}}>
    <Audio src={staticFile(AUDIO)} />
    {revealing && <ShotContent shot={outgoing} />}
    <AbsoluteFill style={{clipPath: revealing ? `circle(${radius}px at ${bridge.x}px ${bridge.y}px)` : undefined}}>
      <ShotContent shot={shot} />
    </AbsoluteFill>
  </AbsoluteFill>;
};
