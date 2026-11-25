// Recursos de demo reutilizables: teléfono, sticker del motivo (A22), cifra tragamonedas (A26),
// ráfaga de héroes con rastro (A29), subrayado a mano y confeti.
import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile} from "remotion";
import {useTime, springAt, rampAt} from "./time";
import {BG, fonts, SPRING, UI} from "./tokens";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---------- teléfono ----------
/** Marco de teléfono (radio 86, isla dinámica). `children` es la pantalla. */
export const Phone: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  screen?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, w = 520, h = 1040, rotate = 0, screen = "#F4F1EC", children, style}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: w * 0.165,
      background: UI.ink,
      padding: w * 0.03,
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 50px 90px -40px rgba(0,0,0,0.55)",
      ...style,
    }}
  >
    <div style={{position: "relative", width: "100%", height: "100%", borderRadius: w * 0.14, background: screen, overflow: "hidden"}}>
      <div style={{position: "absolute", top: w * 0.03, left: "50%", width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: 99, background: UI.ink, zIndex: 5}} />
      {children}
    </div>
  </div>
);

// ---------- sticker del objeto motivo con estado (A22) ----------
/**
 * Círculo con el objeto motivo y un anillo de progreso. `progress` son keys {at, value 0–1};
 * el anillo avanza con spring en cada key. `label` opcional (p. ej. "+17 %") debajo.
 */
export const MotifSticker: React.FC<{
  src: string;
  at: number;
  out?: number;
  center?: {x: number; y: number};
  size?: number;
  progress?: {at: number; value: number}[];
  ringColor?: string;
  label?: {at: number; text: string};
  imgScale?: number;
}> = ({src, at, out, center = {x: 900, y: 380}, size = 180, progress = [], ringColor = UI.ok, label, imgScale = 0.82}) => {
  const {t, fps} = useTime();
  if (t < at || (out != null && t >= out + 0.2)) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  const x = out != null ? rampAt(t, out, out + 0.2, Easing.in(Easing.cubic)) : 0;
  let v = 0;
  for (const k of progress) if (t >= k.at) v = v + (k.value - v) * springAt(t, k.at, fps, SPRING.soft);
  const R = size / 2 + 10;
  const C = 2 * Math.PI * R;
  const lp = label ? springAt(t, label.at, fps, SPRING.accent) : 0;
  return (
    <div style={{position: "absolute", left: center.x - size / 2, top: center.y - size / 2, width: size, height: size, transform: `scale(${e * (1 - x)})`}}>
      <div style={{position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", border: `5px solid ${UI.ink}`, overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
        <Img src={staticFile(src)} style={{height: `${imgScale * 100}%`, imageRendering: "pixelated", transform: `translateY(4%) scale(${1 + 0.015 * Math.sin((2 * Math.PI * t) / 2.4)})`}} />
      </div>
      <svg width={size + 40} height={size + 40} style={{position: "absolute", left: -20, top: -20, transform: "rotate(-90deg)"}}>
        <circle cx={size / 2 + 20} cy={size / 2 + 20} r={R} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={9} />
        <circle cx={size / 2 + 20} cy={size / 2 + 20} r={R} fill="none" stroke={ringColor} strokeWidth={9} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(1, v))} />
      </svg>
      {label && t >= label.at ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: size + 14,
            transform: `translateX(-50%) scale(${lp}) rotate(-4deg)`,
            background: UI.ink,
            color: "#fff",
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 30,
            padding: "6px 16px",
            borderRadius: 12,
            whiteSpace: "nowrap",
          }}
        >
          {label.text}
        </div>
      ) : null}
    </div>
  );
};

// ---------- cifra tragamonedas (A26) ----------
/** Cada dígito cae girando por varios valores y asienta con spring; cascada de 3 f de izquierda a derecha. */
export const SlotNumber: React.FC<{text: string; at: number; size?: number; color?: string; font?: string; spins?: number}> = ({
  text,
  at,
  size = 160,
  color = UI.ink,
  font,
  spins = 2,
}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const chars = text.split("");
  return (
    <div style={{display: "inline-flex", alignItems: "baseline", fontFamily: font ?? fonts.sans, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: "-0.04em", color, fontVariantNumeric: "tabular-nums"}}>
      {chars.map((c, i) => {
        const start = at + i * (3 / 60);
        const p = springAt(t, start, fps, {damping: 14, stiffness: 180, mass: 0.9});
        if (!/\d/.test(c)) {
          return (
            <span key={i} style={{display: "inline-block", transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>
              {c}
            </span>
          );
        }
        const d = Number(c);
        const total = spins * 10 + d; // posiciones que recorre la tira
        const pos = total * p;
        const blur = Math.min(6, Math.abs(1 - p) * 10);
        return (
          <span key={i} style={{display: "inline-block", height: "1em", overflow: "hidden", position: "relative", width: "0.62em"}}>
            <span style={{position: "absolute", left: 0, top: 0, transform: `translateY(${-(pos % 10) - 0}em)`, filter: `blur(${blur.toFixed(1)}px)`}}>
              {Array.from({length: 11}, (_, k) => (
                <span key={k} style={{display: "block", height: "1em"}}>
                  {(Math.floor(pos / 10) * 10 + k) % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ---------- ráfaga de héroes con rastro (A29) ----------
export type HeroItem = {icon: string; name: string; color: string; textColor?: string; at: number};
/** Un héroe por nombre (ícono grande + nombre, fondo de su color) y los anteriores apilados como rastro. */
export const HeroBurst: React.FC<{items: HeroItem[]; out: number; trail?: {x: number; y: number}; iconSize?: number; centerY?: number}> = ({
  items,
  out,
  trail = {x: 80, y: 640},
  iconSize = 280,
  centerY = 980,
}) => {
  const {t, fps} = useTime();
  const idx = items.map((it) => t >= it.at).lastIndexOf(true);
  if (idx < 0 || t >= out) return null;
  const cur = items[idx];
  const e = springAt(t, cur.at, fps, SPRING.accent);
  const far = 2300;
  const r = interpolate(t, [cur.at, cur.at + 0.22], [0, far], {...clamp, easing: Easing.out(Easing.cubic)});
  const prevColor = idx > 0 ? items[idx - 1].color : null;
  return (
    <AbsoluteFill>
      {prevColor ? <AbsoluteFill style={{background: prevColor}} /> : null}
      <AbsoluteFill style={{background: cur.color, clipPath: prevColor ? `circle(${r}px at 540px ${centerY}px)` : undefined}} />
      {items.slice(0, idx).map((it, k) => {
        const te = springAt(t, items[k + 1].at, fps, SPRING.card);
        return (
          <div key={it.name} style={{position: "absolute", left: trail.x, top: trail.y + k * 100, width: 80, height: 80, borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 12px 24px -12px rgba(0,0,0,0.45)", transform: `scale(${te})`}}>
            <Img src={staticFile(it.icon)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
          </div>
        );
      })}
      <div style={{position: "absolute", left: 540 - iconSize / 2, top: centerY - iconSize / 2, width: iconSize, height: iconSize, borderRadius: iconSize * 0.24, overflow: "hidden", background: "#fff", boxShadow: "0 40px 70px -30px rgba(0,0,0,0.5)", transform: `scale(${0.3 + 0.7 * e}) rotate(${(1 - e) * -10}deg)`}}>
        <Img src={staticFile(cur.icon)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: centerY + iconSize / 2 + 40, textAlign: "center", fontFamily: fonts.sans, fontWeight: 800, fontSize: 104, letterSpacing: "-0.04em", color: cur.textColor ?? "#fff", opacity: Math.min(1, e * 1.6), transform: `translateY(${(1 - e) * 40}px)`}}>
        {cur.name}
      </div>
    </AbsoluteFill>
  );
};

// ---------- subrayado a mano ----------
export const HandUnderline: React.FC<{at: number; x: number; y: number; w: number; color?: string; dur?: number}> = ({at, x, y, w, color = BG.amarillo, dur = 0.25}) => {
  const {t} = useTime();
  if (t < at) return null;
  const p = rampAt(t, at, at + dur, Easing.out(Easing.cubic));
  return (
    <svg width={w + 20} height={40} style={{position: "absolute", left: x - 10, top: y}}>
      <path d={`M10,24 C${w * 0.3},10 ${w * 0.6},34 ${w + 10},14`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
    </svg>
  );
};

// ---------- confeti ----------
export const Confetti: React.FC<{at: number; origin: {x: number; y: number}; count?: number; colors?: string[]; seed?: string}> = ({
  at,
  origin,
  count = 40,
  colors = [BG.amarillo, BG.violeta, BG.coral, BG.cobalto, "#FF3D7F", UI.ok],
  seed = "confetti",
}) => {
  const {t} = useTime();
  const tau = t - at;
  if (tau < 0 || tau > 1.3) return null;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {Array.from({length: count}, (_, i) => {
        const a = (-90 + (random(`${seed}a${i}`) - 0.5) * 150) * (Math.PI / 180);
        const v = 900 + 900 * random(`${seed}v${i}`);
        const x = origin.x + Math.cos(a) * v * tau;
        const y = origin.y + Math.sin(a) * v * tau + 0.5 * 1800 * tau * tau;
        const rot = (random(`${seed}r${i}`) - 0.5) * 900 * tau;
        const o = interpolate(tau, [0.9, 1.3], [1, 0], clamp);
        const c = colors[i % colors.length];
        return i % 3 === 0 ? (
          <circle key={i} cx={x} cy={y} r={8} fill={c} opacity={o} />
        ) : (
          <rect key={i} x={x - 3} y={y - 8} width={6 * 2} height={16} fill={c} opacity={o} transform={`rotate(${rot} ${x} ${y})`} />
        );
      })}
    </svg>
  );
};
