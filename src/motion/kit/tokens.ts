// Tokens de Monark Motion (ver .claude/skills/monark-motion/reference.md)
export {fonts} from "../../theme";

export const BG = {
  crema: "#F1ECE3",
  piedra: "#D9D6D0",
  amarillo: "#EFAF1A",
  violeta: "#6C4CF5",
  coral: "#FF5B3A",
  cobalto: "#2F5BEA",
  tinta: "#141210",
  menta: "#C8F1DD",
  rosa: "#FF3D7F",
} as const;
export type BgName = keyof typeof BG;

/** Color de titular y de acento según el fondo (tabla de reference.md §1). */
export const TEXT_ON: Record<BgName | "presentador", {text: string; accent: string}> = {
  crema: {text: "#121212", accent: "#6C4CF5"},
  piedra: {text: "#121212", accent: "#121212"},
  amarillo: {text: "#121212", accent: "#121212"},
  violeta: {text: "#FFFFFF", accent: "#FFD34D"},
  coral: {text: "#121212", accent: "#FFFFFF"},
  cobalto: {text: "#FFFFFF", accent: "#FFD34D"},
  tinta: {text: "#FFFFFF", accent: "#EFAF1A"},
  menta: {text: "#121212", accent: "#128C4A"},
  rosa: {text: "#FFFFFF", accent: "#121212"},
  presentador: {text: "#FFFFFF", accent: "#EFAF1A"},
};

export const UI = {
  ink: "#121212",
  card: "#FFFFFF",
  cardBorder: "rgba(0,0,0,0.08)",
  cardShadow: "0 40px 80px -30px rgba(0,0,0,0.35)",
  dark: "#1C1B1F",
  darkText: "#EDEDED",
  darkMute: "#8B8B93",
  ok: "#22B35E",
  err: "#E5484D",
  info: "#2F5BEA",
  mute: "#8A8580",
  line: "#ECE7DF",
};

export const LAYOUT = {
  W: 1080,
  H: 1920,
  marginX: 80,
  headlineTop: 200,
  headlineWidth: 920, // sin sticker del presentador, el titular usa casi todo el ancho
  splitHeadlineTop: 170, // titular en modo dividido
  splitStageTop: 470, // tarjeta en modo dividido (debe terminar antes de y = 1060)
};

/** Springs en unidades de frame (válidos a 30 y 60 fps). */
export const SPRING = {
  card: {damping: 15, stiffness: 170, mass: 0.9},
  accent: {damping: 12, stiffness: 200, mass: 0.7},
  stamp: {damping: 9, stiffness: 260, mass: 0.8},
  soft: {damping: 18, stiffness: 140, mass: 1},
};
