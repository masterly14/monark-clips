// Piezas compartidas por la intro y la pieza larga de catalina-reel.
import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from "remotion";
import {BG, fonts, Headline, rampAt, springAt, SPRING, UI, useTime, type BgName, type HWord} from "../kit";

export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const GREEN = "#128C4A";
export const inW = (t: number, a: number, b: number) => t >= a && t < b;
export const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.floor(interpolate(t, [a, b], [0, text.length], clamp)));

/** Fondo de la pieza: blanco liso (pedido del usuario). */
export const White: React.FC = () => <AbsoluteFill style={{background: "#FFFFFF"}} />;

/** Titular con los tamaños de la skill: sans 84 (104 en gancho y cierre), acento 1,25×. Sobre blanco usa los colores de `crema`. */
export const H: React.FC<{w: [string, number, boolean?][]; from: number; to: number; on?: BgName | "presentador"; size?: number; top?: number; width?: number; exit?: boolean}> = ({
  w, from, to, on = "crema", size = 84, top = 300, width = 760, exit = true,
}) => {
  const words: HWord[] = w.map(([t, at, accent]) => ({t, at, accent}));
  return <Headline words={words} from={from} to={to} on={on} size={size} accentSize={Math.round(size * 1.25)} top={top} width={width} exit={exit} />;
};

export const enterY = (t: number, at: number, fps: number, dist = 120) => {
  const e = springAt(t, at, fps, SPRING.card);
  return {opacity: Math.min(1, e * 1.6), transform: `translateY(${(1 - e) * dist}px) scale(${0.94 + 0.06 * e})`};
};

export const Chip: React.FC<{at: number; x: number; y: number; children: React.ReactNode; bg?: string; color?: string; rotate?: number; size?: number; until?: number; mono?: boolean}> = ({
  at, x, y, children, bg = "#fff", color = UI.ink, rotate = 0, size = 30, until, mono = true,
}) => {
  const {t, fps} = useTime();
  if (t < at || (until != null && t >= until + 0.2)) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  const o = until != null ? rampAt(t, until, until + 0.2, Easing.in(Easing.cubic)) : 0;
  const drift = 6 * Math.sin((2 * Math.PI * (t - at)) / 2.2);
  return (
    <div style={{position: "absolute", left: x, top: y + drift, transform: `scale(${e * (1 - o)}) rotate(${rotate}deg)`, transformOrigin: "0 50%", background: bg, color, fontFamily: mono ? fonts.mono : fonts.sans, fontWeight: mono ? 500 : 700, fontSize: size, padding: `${size * 0.4}px ${size * 0.7}px`, borderRadius: 999, boxShadow: "0 18px 34px -16px rgba(0,0,0,0.5)", border: "1.5px solid rgba(0,0,0,0.08)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12}}>
      {children}
    </div>
  );
};

/** Check verde que se dibuja (10 f). */
export const CheckBox: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 46, color = UI.ok}) => {
  const {t} = useTime();
  const c = rampAt(t, at, at + 10 / 30, Easing.out(Easing.cubic));
  return (
    <div style={{width: size, height: size, borderRadius: size * 0.28, background: c > 0 ? color : "transparent", border: `3px solid ${c > 0 ? color : "#D5D0C8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${1 + 0.12 * Math.sin(Math.PI * c)})`}}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 * (1 - c)} /></svg>
    </div>
  );
};

/** Líneas de énfasis (emanata) alrededor de un punto. */
export const Emanata: React.FC<{at: number; x: number; y: number; color?: string; angles?: number[]}> = ({at, x, y, color = BG.violeta, angles = [-150, -120, -90, -60, -30]}) => {
  const {t} = useTime();
  const p = rampAt(t, at, at + 0.18);
  const o = interpolate(t, [at + 0.5, at + 0.8], [1, 0], clamp);
  if (t < at || o <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      {angles.map((a, i) => {
        const r1 = 60 + 30 * p;
        const r2 = r1 + 50 * p;
        const rad = (a * Math.PI) / 180;
        return <line key={i} x1={x + Math.cos(rad) * r1} y1={y + Math.sin(rad) * r1} x2={x + Math.cos(rad) * r2} y2={y + Math.sin(rad) * r2} stroke={color} strokeWidth={8} strokeLinecap="round" opacity={o} />;
      })}
    </svg>
  );
};

export const MonarkMark: React.FC<{size: number; radius?: number}> = ({size, radius = 0.27}) => (
  <div style={{width: size, height: size, borderRadius: size * radius, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: UI.cardShadow, border: "1.5px solid rgba(0,0,0,0.08)"}}>
    <Img src={staticFile("brand/monark-mark.png")} style={{width: "70%"}} />
  </div>
);

/** El objeto motivo: el reporte a propietarios. `fold` 0 → hoja, 1 → sobre cerrado. */
export const ReportDoc: React.FC<{w?: number; fold?: number; fill?: number; month?: string; sent?: boolean; sentAt?: number}> = ({w = 360, fold = 0, fill = 1, month = "noviembre", sent = false, sentAt = 0}) => {
  const {t, fps} = useTime();
  const h = w * 1.2;
  const flapH = h * 0.38;
  const s = sent ? springAt(t, sentAt, fps, SPRING.accent) : 0;
  return (
    <div style={{position: "relative", width: w, height: h}}>
      {/* hoja */}
      <div style={{position: "absolute", inset: 0, background: "#fff", borderRadius: 18, border: `3px solid ${UI.ink}`, padding: w * 0.08, boxSizing: "border-box", transform: `scaleY(${1 - 0.55 * fold})`, transformOrigin: "50% 100%", opacity: 1 - rampAt(fold, 0.6, 1)}}>
        <div style={{fontFamily: fonts.mono, fontSize: w * 0.06, color: UI.mute}}>// reporte · {month}</div>
        <div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: w * 0.095, marginTop: w * 0.03, lineHeight: 1.05}}>Propietarios</div>
        {["ingresos", "gastos", "ocupación", "pagos"].map((r, i) => (
          <div key={r} style={{display: "flex", alignItems: "center", gap: w * 0.03, marginTop: w * 0.05}}>
            <span style={{fontFamily: fonts.mono, fontSize: w * 0.05, color: UI.mute, width: w * 0.3}}>{r}</span>
            <div style={{flex: 1, height: w * 0.035, borderRadius: 10, background: "#ECE7DF", overflow: "hidden"}}>
              <div style={{height: "100%", width: `${100 * Math.min(1, Math.max(0, fill * 4 - i)) * [0.82, 0.46, 0.7, 0.9][i]}%`, background: [BG.violeta, BG.coral, BG.cobalto, GREEN][i], borderRadius: 10}} />
            </div>
          </div>
        ))}
      </div>
      {/* sobre */}
      {fold > 0 ? (
        <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: h * 0.62, opacity: rampAt(fold, 0.35, 0.7)}}>
          <div style={{position: "absolute", inset: 0, background: "#FFF6DD", border: `3px solid ${UI.ink}`, borderRadius: 18}} />
          <svg width={w} height={flapH} viewBox={`0 0 ${w} ${flapH}`} style={{position: "absolute", left: 0, top: 0, transformOrigin: "50% 0", transform: `scaleY(${interpolate(fold, [0.7, 1], [-1, 1], clamp)})`}}>
            <path d={`M3 3 L${w / 2} ${flapH - 6} L${w - 3} 3`} fill="#FFE8A3" stroke={UI.ink} strokeWidth={3} strokeLinejoin="round" />
          </svg>
          <div style={{position: "absolute", left: w * 0.08, bottom: w * 0.07, fontFamily: fonts.mono, fontSize: w * 0.055, color: UI.ink}}>reporte · {month}</div>
          {sent ? (
            <div style={{position: "absolute", right: -w * 0.08, top: -w * 0.1, transform: `scale(${s}) rotate(8deg)`, background: UI.ok, color: "#fff", borderRadius: 999, padding: `${w * 0.025}px ${w * 0.05}px`, fontFamily: fonts.sans, fontWeight: 800, fontSize: w * 0.065, boxShadow: "0 10px 20px -10px rgba(0,0,0,0.5)", whiteSpace: "nowrap"}}>
              ✓ enviado
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
