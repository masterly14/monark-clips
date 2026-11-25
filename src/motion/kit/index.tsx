import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from "remotion";
import {Video} from "@remotion/media";
import {BG, type BgName, fonts, LAYOUT, SPRING, TEXT_ON, UI} from "./tokens";

export * from "./tokens";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---------- tiempo ----------
import {useTime, springAt, rampAt} from "./time";
export {useTime, springAt, rampAt} from "./time";
export * from "./camera";
export * from "./rupture";
export * from "./presenter-stage";
export * from "./pieces";
export * from "./sfx";

// ---------- fondo de acto ----------
export const ActBackground: React.FC<{bg: BgName}> = ({bg}) => (
  <AbsoluteFill
    style={{
      background: BG[bg],
      backgroundImage: bg === "crema" ? "radial-gradient(#DDD5C8 2px, transparent 2px)" : undefined,
      backgroundSize: bg === "crema" ? "28px 28px" : undefined,
    }}
  />
);

// ---------- titular palabra por palabra ----------
export type HWord = {t: string; at: number; accent?: boolean};

export const Headline: React.FC<{
  words: HWord[];
  from: number;
  to: number;
  on: BgName | "presentador";
  size?: number;
  accentSize?: number;
  width?: number;
  top?: number;
  exit?: boolean;
}> = ({words, from, to, on, size = 118, accentSize, width = LAYOUT.headlineWidth, top = LAYOUT.headlineTop, exit = true}) => {
  const {t, fps} = useTime();
  if (t < from || t >= to) return null;
  const colors = TEXT_ON[on];
  const aSize = accentSize ?? Math.round(size * 1.6);
  const out = exit ? rampAt(t, to - 8 / 60, to, Easing.in(Easing.cubic)) : 0; // 8 f @60
  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.marginX,
        top,
        width,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        columnGap: size * 0.24,
        rowGap: 0,
        opacity: 1 - out,
        transform: `translateY(${-30 * out}px)`,
      }}
    >
      {words.map((w, i) => {
        const shown = t >= w.at;
        const p = rampAt(t, w.at, w.at + 9 / 60); // 9 f @60
        const s = w.accent ? springAt(t, w.at, fps, SPRING.accent) : 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              padding: w.accent ? "0 0.12em 0.06em 0.02em" : "0 0 0.08em",
              marginBottom: w.accent ? -aSize * 0.06 : 0,
              visibility: shown ? "visible" : "hidden",
            }}
          >
            <span
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
                fontFamily: w.accent ? fonts.serif : fonts.sans,
                fontStyle: w.accent ? "italic" : "normal",
                fontWeight: w.accent ? 400 : 700,
                fontSize: w.accent ? aSize : size,
                lineHeight: w.accent ? 0.85 : 0.98,
                letterSpacing: w.accent ? "-0.01em" : "-0.035em",
                color: w.accent ? colors.accent : colors.text,
                transform: `translateY(${(1 - p) * 0.5}em) scale(${w.accent ? 1.08 - 0.08 * s : 1})`,
                transformOrigin: "left bottom",
                filter: `blur(${(1 - p) * 8}px)`,
                opacity: p,
              }}
            >
              {w.t}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ---------- personaje en halftone ----------
export type Expression =
  | "neutral" | "sonrisa" | "habla" | "guino" | "preocupado" | "feliz-ojos-cerrados" | "sorpresa"
  | "mira-titular" | "mira-abajo-derecha" | "peek-derecha" | "peek-abajo";

const CHAR_W = 682; // tamaño de character/ht/<expresión>.png
const CHAR_H = 752;

export const Character: React.FC<{
  schedule: {at: number; name: Expression}[];
  from: number;
  to: number;
  height?: number;
  top?: number;
  centerX?: number;
  variant?: "ht" | "ink";
  enter?: boolean;
}> = ({schedule, from, to, height = 1000, top = 1180, centerX = 640, variant = "ht", enter = true}) => {
  const {t, fps} = useTime();
  if (t < from || t >= to) return null;
  const current = [...schedule].reverse().find((s) => t >= s.at) ?? schedule[0];
  const w = (height * CHAR_W) / CHAR_H;
  const e = enter ? springAt(t, from, fps, SPRING.card) : 1;
  const breathe = 1 + 0.015 * Math.sin((2 * Math.PI * t) / 2.4);
  const sway = 1.5 * Math.sin((2 * Math.PI * t) / 3.1);
  const file = `character/ht/${current.name}${variant === "ink" ? "-ink" : ""}.png`;
  return (
    <Img
      src={staticFile(file)}
      style={{
        position: "absolute",
        left: centerX - w / 2,
        top: top + (1 - e) * 260,
        width: w,
        height,
        imageRendering: "pixelated",
        transformOrigin: "50% 100%",
        transform: `scale(${breathe}) rotate(${sway}deg)`,
      }}
    />
  );
};

// ---------- presentador: cámara, pantalla dividida o relevo a la gráfica ----------
// En pantalla dividida el presentador ocupa la mitad inferior
// (panel desde SPLIT_TOP) con el rostro grande, y la gráfica vive en la mitad superior.
export type PresenterSeg = {from: number; to: number; mode: "full" | "split" | "graphics"};

const FACE = {x: 620, y: 880}; // centro del rostro en el video fuente (1080×1916)
export const SPLIT_TOP = 1080; // dónde empieza el panel del presentador en modo dividido
const SPLIT_FACE_Y = 1470; // dónde queda el rostro en modo dividido
const SLIDE = 0.4; // duración del deslizamiento full ↔ split (s)

export const Presenter: React.FC<{
  src: string;
  segments: PresenterSeg[];
  veil?: boolean;
  face?: {x: number; y: number};
  sourceHeight?: number;
  splitZoom?: number;
  muted?: boolean;
}> = ({src, segments, veil = true, face = FACE, sourceHeight = 1916, splitZoom = 1.04, muted = false}) => {
  const {t} = useTime();
  const i = Math.max(0, segments.findIndex((s) => t >= s.from && t < s.to));
  const seg = segments[i];
  if (!seg || seg.mode === "graphics") return null;
  const prev = segments[i - 1];
  const ease = Easing.inOut(Easing.cubic);
  let p: number; // 0 = pantalla completa, 1 = dividida
  if (seg.mode === "split") p = prev?.mode === "full" ? interpolate(t, [seg.from, seg.from + SLIDE], [0, 1], {...clamp, easing: ease}) : 1;
  else p = prev?.mode === "split" ? interpolate(t, [seg.from, seg.from + SLIDE], [1, 0], {...clamp, easing: ease}) : 0;

  // zoom lento en pantalla completa; en el panel 1.18× (mínimo para cubrir los 1080 px con el rostro centrado en x = 540)
  const SPLIT_SCALE = 1.18;
  const zoomFull = seg.mode === "full" ? 1 + 0.05 * Math.min(1, (t - seg.from) / Math.max(1, seg.to - seg.from)) : 1;
  const s = zoomFull + (SPLIT_SCALE - zoomFull) * p;
  const panelTop = SPLIT_TOP * p;
  const faceY = face.y + (SPLIT_FACE_Y - face.y) * p;
  const videoLeft = face.x + (540 - face.x) * p - face.x * s;
  const videoTop = faceY - face.y * s;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: panelTop,
          bottom: 0,
          overflow: "hidden",
          boxShadow: p > 0 ? "0 -24px 50px rgba(0,0,0,0.28)" : undefined,
        }}
      >
        <div style={{position: "absolute", left: videoLeft, top: videoTop - panelTop, width: 1080 * s, height: sourceHeight * s}}>
          <Video src={staticFile(src)} muted={muted} style={{width: "100%", height: "100%"}} objectFit="fill" />
        </div>
      </div>
      {/* velo superior para leer el titular cuando está a pantalla completa */}
      {veil ? (
        <AbsoluteFill
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0) 48%)",
            opacity: 1 - p,
          }}
        />
      ) : null}
    </>
  );
};
// ---------- tarjeta de UI ----------
const Dots = () => (
  <div style={{display: "flex", gap: 10}}>
    {["#ED6A5E", "#F5BF4F", "#61C554"].map((c) => (
      <span key={c} style={{width: 18, height: 18, borderRadius: 18, background: c}} />
    ))}
  </div>
);

export const UICard: React.FC<{
  at: number;
  out?: number;
  width?: number;
  top: number;
  variant?: "light" | "dark";
  title?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, out, width = 860, top, variant = "light", title, children, style}) => {
  const {t, fps} = useTime();
  if (t < at || (out != null && t >= out)) return null;
  const e = springAt(t, at, fps, SPRING.card);
  const x = out != null ? rampAt(t, out - 10 / 60, out, Easing.in(Easing.cubic)) : 0;
  const dark = variant === "dark";
  return (
    <div
      style={{
        position: "absolute",
        left: (LAYOUT.W - width) / 2,
        top,
        width,
        borderRadius: 28,
        background: dark ? UI.dark : UI.card,
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : UI.cardBorder}`,
        boxShadow: UI.cardShadow,
        overflow: "hidden",
        opacity: Math.min(1, e * 1.5) * (1 - x),
        transform: `translateY(${(1 - e) * 80}px) scale(${(0.94 + 0.06 * e) * (1 - 0.04 * x)}) rotate(${-2 * (1 - e)}deg)`,
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 28px",
            borderBottom: `1.5px solid ${dark ? "rgba(255,255,255,0.08)" : UI.line}`,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 28,
            color: dark ? UI.darkText : UI.ink,
          }}
        >
          <Dots />
          {title}
        </div>
      ) : null}
      <div style={{padding: 40}}>{children}</div>
    </div>
  );
};

export const MonoLabel: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = UI.mute, size = 25}) => (
  <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: size, color}}>{children}</div>
);

// ---------- piezas de UI ----------
export const Pill: React.FC<{tone: "ok" | "err" | "info" | "warn" | "neutral"; children: React.ReactNode; at?: number; size?: number}> = ({
  tone,
  children,
  at = -1,
  size = 24,
}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const c = {ok: UI.ok, err: UI.err, info: UI.info, warn: "#C98A00", neutral: "#555"}[tone];
  const e = at < 0 ? 1 : springAt(t, at, fps, SPRING.accent);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: `${size * 0.3}px ${size * 0.65}px`,
        borderRadius: 999,
        background: `${c}1F`,
        color: c,
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: size,
        transform: `scale(${0.7 + 0.3 * e})`,
        opacity: Math.min(1, e * 1.5),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export const Check: React.FC<{at: number; size?: number}> = ({at, size = 52}) => {
  const {t} = useTime();
  const p = rampAt(t, at, at + 10 / 60);
  const on = t >= at;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        flexShrink: 0,
        border: `3px solid ${on ? UI.ok : "#D5D0C8"}`,
        background: on ? UI.ok : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 * (1 - p)} />
      </svg>
    </div>
  );
};

/** Texto que se escribe repartiendo los caracteres en la ventana [from, to]. */
export const Typewriter: React.FC<{text: string; from: number; to: number; caret?: boolean; style?: React.CSSProperties}> = ({text, from, to, caret = true, style}) => {
  const {t} = useTime();
  const n = Math.floor(interpolate(t, [from, to], [0, text.length], clamp));
  const blink = Math.floor(t / 0.53) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && t >= from - 0.4 && (t < to + 0.8) ? <span style={{opacity: blink ? 1 : 0}}>|</span> : null}
    </span>
  );
};

export const Counter: React.FC<{from: number; to: number; at: number; dur?: number; format?: (n: number) => string; style?: React.CSSProperties}> = ({
  from,
  to,
  at,
  dur = 0.8,
  format = (n) => String(Math.round(n)),
  style,
}) => {
  const {t} = useTime();
  const v = interpolate(t, [at, at + dur], [from, to], {...clamp, easing: Easing.out(Easing.exp)});
  return <span style={{fontVariantNumeric: "tabular-nums", ...style}}>{format(v)}</span>;
};

export const Cursor: React.FC<{path: {x: number; y: number; at: number}[]; clicks?: number[]; hideAt?: number}> = ({path, clicks = [], hideAt}) => {
  const {t} = useTime();
  if (t < path[0].at || (hideAt != null && t >= hideAt)) return null;
  let x = path[0].x;
  let y = path[0].y;
  for (let k = 1; k < path.length; k++) {
    const a = path[k - 1];
    const b = path[k];
    if (t >= a.at) {
      const q = interpolate(t, [a.at, b.at], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
      x = a.x + (b.x - a.x) * q;
      y = a.y + (b.y - a.y) * q - Math.sin(q * Math.PI) * 40; // curva leve
    }
  }
  const press = clicks.some((c) => t >= c && t < c + 4 / 60 * 2) ? 0.85 : 1;
  const ripple = clicks.map((c) => interpolate(t, [c, c + 0.4], [0, 1], clamp)).find((v) => v > 0 && v < 1);
  return (
    <>
      {ripple != null ? (
        <div
          style={{
            position: "absolute",
            left: x - 60 * ripple,
            top: y - 60 * ripple,
            width: 120 * ripple,
            height: 120 * ripple,
            borderRadius: "50%",
            border: `4px solid ${UI.ink}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        style={{position: "absolute", left: x, top: y, transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))"}}
      >
        <path d="M4 2l16 9.5-7 1.6-3.6 6.6z" fill="#fff" stroke={UI.ink} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Sello de resolución: serif itálica blanca en etiqueta negra, golpea con rebote. */
export const Stamp: React.FC<{text: string; at: number; x: number; y: number; size?: number}> = ({text, at, x, y, size = 120}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const s = springAt(t, at, fps, SPRING.stamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(-4deg) scale(${2.4 - 1.4 * s})`,
        opacity: Math.min(1, s * 3),
        background: UI.ink,
        color: "#fff",
        borderRadius: 14,
        padding: "14px 40px 22px",
        fontFamily: fonts.serif,
        fontStyle: "italic",
        fontSize: size,
        lineHeight: 1,
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Sacudida de pantalla (±6 px, 3 f @60) a partir de `at`. */
export const shake = (t: number, at: number) => {
  const d = t - at;
  if (d < 0 || d > 0.1) return "none";
  const k = Math.round(d * 60);
  return `translate(${[6, -5, 3, -2, 1, 0, 0][k] ?? 0}px, ${[-4, 5, -3, 2, -1, 0, 0][k] ?? 0}px)`;
};

/** Ícono de app (logo de marca recortado a cuadrado redondeado). */
export const AppIcon: React.FC<{src: string; zoom?: number; size?: number}> = ({src, zoom = 1, size = 120}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, overflow: "hidden", boxShadow: "0 16px 30px -14px rgba(0,0,0,0.45)", background: "#fff"}}>
    <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}} />
  </div>
);