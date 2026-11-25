import React from "react";
import {Easing, Img, staticFile} from "remotion";
import {fonts, rampAt, useTime, type Expression} from "../kit";
import {at} from "./timeline";

export const palette = {
  paper: "#F5EDDE",
  ink: "#181610",
  gold: "#F2B71F",
  purple: "#522DBF",
  orange: "#FF7356",
  blue: "#2245CF",
  lime: "#E7ED8B",
  green: "#226047",
} as const;

export function motion(t: number, start: number, duration = 0.3, easing = Easing.out(Easing.cubic)) {
  return rampAt(t, start, start + duration, easing);
}

export const Box: React.FC<React.PropsWithChildren<{
  x: number; y: number; w: number; h?: number; style?: React.CSSProperties;
}>> = ({x, y, w, h, style, children}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, height: h, ...style}}>{children}</div>
);

export const Paper: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({style, children}) => (
  <div style={{background: "#FFFCF4", border: "2px solid #281E181F", borderRadius: 34, boxShadow: "0 27px 56px #18161030",
    color: palette.ink, padding: "28px 33px", boxSizing: "border-box", ...style}}>{children}</div>
);

export const Mono: React.FC<React.PropsWithChildren<{size?: number; color?: string}>> = ({size = 25, color, children}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: size, color, letterSpacing: "-0.025em"}}>{children}</div>
);

export const Label: React.FC<React.PropsWithChildren<{color?: string; bg?: string; size?: number}>> = ({
  color = palette.ink, bg = "#EEE6D5", size = 25, children,
}) => (
  <span style={{display: "inline-block", background: bg, color, borderRadius: 99, padding: "13px 19px",
    fontFamily: fonts.mono, fontWeight: 500, fontSize: size, whiteSpace: "nowrap"}}>{children}</span>
);

export const Copy: React.FC<{
  x: number; y: number; w: number; color?: string; accent?: string; size: number; align?: "left" | "center" | "right";
  words: [string, number, boolean?][]; axis?: "x" | "y"; style?: React.CSSProperties;
}> = ({x, y, w, color = palette.ink, accent = color, size, align = "left", words, axis = "y", style}) => {
  const {t} = useTime();
  return <Box x={x} y={y} w={w} style={{textAlign: align, fontSize: size, lineHeight: 0.96, letterSpacing: "-0.065em",
    fontWeight: 800, color, ...style}}>
    {words.map(([text, word, emph], index) => {
      const p = motion(t, at(word), 0.18);
      const displacement = (1 - p) * 0.62;
      return <React.Fragment key={index}>
        {index > 0 && " "}
        <span style={{display: "inline-block", overflow: "hidden", verticalAlign: "baseline",
          padding: emph ? "0 0.10em 0.09em 0.025em" : "0 0.015em 0.08em"}}>
          <span style={{display: "inline-block", whiteSpace: "nowrap", opacity: p,
            transform: axis === "x" ? `translateX(${-displacement}em)` : `translateY(${displacement}em)`,
            filter: p >= 1 ? undefined : `blur(${(1 - p) * 4}px)`,
            color: emph ? accent : color, fontFamily: emph ? fonts.serif : fonts.sans,
            fontStyle: emph ? "italic" : "normal", fontWeight: emph ? 400 : 800,
            fontSize: emph ? "1.38em" : "1em",
          }}>{text}</span>
        </span>
      </React.Fragment>;
    })}
  </Box>;
};

export const Toy: React.FC<{x: number; y: number; w: number; pose: Expression; turn?: number; tint?: boolean}> = ({
  x, y, w, pose, turn = 0, tint,
}) => {
  const {t} = useTime();
  return <Box x={x} y={y} w={w} style={{transform: `rotate(${turn + 1.5 * Math.sin(t * 2.1)}deg) scale(${1 + 0.012 * Math.sin(t * 3)})`}}>
    <Img src={staticFile(`character/ht/${pose}${tint ? "-ink" : ""}.png`)} style={{width: "100%", imageRendering: "pixelated"}} />
  </Box>;
};

export const Glyph: React.FC<{icon: "id" | "page" | "door" | "bell" | "check"; size?: number; color?: string; weight?: number}> = ({
  icon, size = 64, color = palette.ink, weight = 1.6,
}) => <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
  <path d={{
    id: "M2 5h20v14H2zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-4 5a4 4 0 0 1 8 0m2-6h4m-4 4h4",
    page: "M13 3H6v18h12V8l-5-5Zm0 0v6h5M9 13h6m-6 4h6",
    door: "M3 22h18M6 22V3h12v19m-4-9v1",
    bell: "M6 9a6 6 0 1 1 12 0c0 5 2 6 2 8H4c0-2 2-3 2-8Zm4 12a2 2 0 0 0 4 0",
    check: "m4 12 5 5 11-11",
  }[icon]} />
</svg>;

export const Lines: React.FC<{color?: string; step?: number}> = ({color = "#39271012", step = 44}) => (
  <div style={{position: "absolute", inset: 0, backgroundImage: `linear-gradient(0deg,${color} 1px,transparent 1px), linear-gradient(90deg,${color} 1px,transparent 1px)`,
    backgroundSize: `${step}px ${step}px`}} />
);
