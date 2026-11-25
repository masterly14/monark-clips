import captions from "../alex-pasaporte/captions.json";

export const FPS = 60;
export const AUDIO = "clips/alex-pasaporte-v2-voz.wav";
const RATE = 1.07;
const spans = [
  [480, 3000], [7000, 12990], [18000, 21090], [23600, 34580],
  [39750, 55210], [60960, 62930], [65960, 75540],
] as const;
export const DURATION = Math.ceil((46.354 + 2.8) * FPS);

export function at(word: number) {
  const {startMs} = captions[word];
  let elapsed = 0;
  for (const [start, end] of spans) {
    if (startMs <= end) return Math.ceil((elapsed + Math.max(0, startMs - start)) * FPS / (1000 * RATE)) / FPS;
    elapsed += end - start;
  }
  return elapsed / (1000 * RATE);
}

export const cuts = {
  hook: 0,
  form: at(18),
  traffic: at(26),
  owner: at(49),
  scan: at(58),
  compare: at(68),
  permit: at(77),
  dispatch: at(87),
  phone: at(108),
  clock: at(118),
  alert: at(126),
  lobby: at(145),
  goodbye: at(175),
  close: at(188),
} as const;
export type Shot = keyof typeof cuts;
export const sequence = Object.entries(cuts) as [Shot, number][];
