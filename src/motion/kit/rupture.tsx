// Ruptura (devices.md A21) y revelaciones nacidas de un objeto (B).
// Orden típico del giro:  Viewfinder (pausa) → BrandDrop (cae) → Shatter / Splash + BlobReveal (rompe)
import React from "react";
import {AbsoluteFill, Easing, interpolate, random} from "remotion";
import {useTime, springAt} from "./time";
import {BG, SPRING} from "./tokens";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
type Pt = {x: number; y: number};

// ---------- pausa con esquinas de visor ----------
/** Esquinas de visor que se dibujan en 8 f y se quedan `dur` s. Marca la pausa antes del impacto. */
export const Viewfinder: React.FC<{at: number; dur?: number; color?: string; inset?: number; len?: number}> = ({
  at,
  dur = 0.4,
  color = "#121212",
  inset = 56,
  len = 90,
}) => {
  const {t} = useTime();
  if (t < at || t > at + dur) return null;
  const p = interpolate(t, [at, at + 8 / 60], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const l = len * p;
  const W = 1080 - inset;
  const H = 1920 - inset;
  const i = inset;
  const d = `M${i},${i + l} L${i},${i} L${i + l},${i} M${W - l},${i} L${W},${i} L${W},${i + l} M${W},${H - l} L${W},${H} L${W - l},${H} M${i + l},${H} L${i},${H} L${i},${H - l}`;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="square" />
    </svg>
  );
};

// ---------- la marca cae desde arriba ----------
/** Un objeto (ícono de Monark) cae con estela y aterriza en `to` exactamente en `at` (el impacto). */
export const BrandDrop: React.FC<{
  at: number;
  to: Pt;
  size?: number;
  fall?: number;
  until?: number;
  trail?: string;
  children: React.ReactNode;
}> = ({at, to, size = 180, fall = 0.14, until, trail = BG.amarillo, children}) => {
  const {t, fps} = useTime();
  if (t < at - fall || (until != null && t >= until)) return null;
  const q = interpolate(t, [at - fall, at], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const y = to.y - 1100 * (1 - q);
  const landed = t >= at;
  const squash = landed ? springAt(t, at, fps, SPRING.stamp) : 0;
  const sy = landed ? 0.82 + 0.18 * squash : 1.12;
  const sx = landed ? 1.12 - 0.12 * squash : 0.92;
  const trailH = landed ? 0 : 420 * Math.min(1, q * 2);
  return (
    <>
      {trailH > 0 ? (
        <div
          style={{
            position: "absolute",
            left: to.x - size * 0.22,
            top: y - trailH,
            width: size * 0.44,
            height: trailH,
            background: `linear-gradient(to bottom, ${trail}00, ${trail}AA)`,
            borderRadius: size,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: to.x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          transformOrigin: "50% 100%",
          transform: `scale(${sx}, ${sy})`,
        }}
      >
        {children}
      </div>
    </>
  );
};

// ---------- geometría de esquirlas ----------
type Shard = {poly: Pt[]; c: Pt; ring: number; dir: Pt; speed: number; spin: number; delay: number};

const buildShards = (origin: Pt, seed: string, sectors: number, radii: number[]): Shard[] => {
  // vértices compartidos: V[ring][sector], con jitter de ángulo y radio para que parezca vidrio
  const V: Pt[][] = radii.map((r, i) =>
    Array.from({length: sectors}, (_, j) => {
      const a = (2 * Math.PI * j) / sectors + (random(`${seed}-a-${i}-${j}`) - 0.5) * ((2 * Math.PI) / sectors) * 0.7;
      const rr = r * (1 + (random(`${seed}-r-${i}-${j}`) - 0.5) * 0.36);
      return {x: origin.x + Math.cos(a) * rr, y: origin.y + Math.sin(a) * rr};
    }),
  );
  const shards: Shard[] = [];
  const R = radii.length;
  for (let i = -1; i < R - 1; i++) {
    for (let j = 0; j < sectors; j++) {
      const j2 = (j + 1) % sectors;
      const poly = i < 0 ? [origin, V[0][j], V[0][j2]] : [V[i][j], V[i][j2], V[i + 1][j2], V[i + 1][j]];
      const c = {x: poly.reduce((s, p) => s + p.x, 0) / poly.length, y: poly.reduce((s, p) => s + p.y, 0) / poly.length};
      const dx = c.x - origin.x;
      const dy = c.y - origin.y;
      const len = Math.hypot(dx, dy) || 1;
      const ring = i + 1; // 0 = centro
      const k = 1 - ring / R;
      shards.push({
        poly,
        c,
        ring,
        dir: {x: dx / len, y: dy / len},
        speed: (900 + 1700 * k) * (0.8 + 0.4 * random(`${seed}-s-${i}-${j}`)),
        spin: (random(`${seed}-w-${i}-${j}`) - 0.5) * 2 * (220 + 420 * k),
        delay: ring * 0.025,
      });
    }
  }
  return shards;
};

/**
 * Rompe lo que envuelve como vidrio desde `origin`. Pon debajo la escena nueva (con su fondo):
 * al volar las esquirlas queda a la vista.  Tiempos: grietas en 3 f desde `at`, luego estallido.
 */
export const Shatter: React.FC<{
  at: number;
  origin: Pt;
  children: React.ReactNode;
  crackColor?: string;
  seed?: string;
  sectors?: number;
  gravity?: number;
  /** cuánto dura la fase de grietas antes de estallar (s) */
  crack?: number;
}> = ({at, origin, children, crackColor = BG.amarillo, seed = "shatter", sectors = 11, gravity = 2600, crack = 0.07}) => {
  const {t} = useTime();
  if (t < at) return <AbsoluteFill>{children}</AbsoluteFill>;
  const far = Math.max(...[{x: 0, y: 0}, {x: 1080, y: 0}, {x: 0, y: 1920}, {x: 1080, y: 1920}].map((p) => Math.hypot(p.x - origin.x, p.y - origin.y)));
  const radii = [110, 300, 640, far + 400];
  const shards = buildShards(origin, seed, sectors, radii);
  const crackP = interpolate(t, [at, at + crack], [0, 1], {...clamp, easing: Easing.out(Easing.exp)});
  const tb = t - at - crack; // tiempo desde el estallido
  if (tb > 1.4) return null;
  const toPoints = (poly: Pt[]) => poly.map((p) => `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`).join(", ");
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      {shards.map((s, k) => {
        const tau = Math.max(0, tb - s.delay);
        const dx = s.dir.x * s.speed * tau;
        const dy = s.dir.y * s.speed * tau - 380 * tau + 0.5 * gravity * tau * tau;
        const rot = s.spin * tau;
        const fade = interpolate(tau, [0.7, 1.1], [1, 0], clamp);
        // la grieta se dibuja de adentro hacia afuera: cada anillo aparece cuando el frente lo alcanza
        const edge = Math.min(1, Math.max(0, crackP * radii.length - (s.ring - 1)));
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `polygon(${toPoints(s.poly)})`,
              transformOrigin: `${s.c.x}px ${s.c.y}px`,
              transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
              opacity: fade,
            }}
          >
            <AbsoluteFill>{children}</AbsoluteFill>
            {edge > 0 ? (
              <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
                <polygon
                  points={s.poly.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={crackColor}
                  strokeWidth={14}
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - edge}
                />
              </svg>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- splash de pintura desde un objeto ----------
export const Splash: React.FC<{at: number; origin: Pt; colors?: string[]; seed?: string; spread?: number; length?: number}> = ({
  at,
  origin,
  colors = [BG.violeta, BG.coral, BG.cobalto, BG.amarillo, "#FF3D7F"],
  seed = "splash",
  spread = 150,
  length = 300,
}) => {
  const {t} = useTime();
  if (t < at || t > at + 1.4) return null;
  const n = 13;
  const grow = interpolate(t, [at, at + 8 / 60], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const fade = interpolate(t, [at + 0.5, at + 0.75], [1, 0], clamp);
  const tau = t - at;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {Array.from({length: n}, (_, i) => {
        const a = (-90 + ((i / (n - 1)) - 0.5) * spread + (random(`${seed}-a${i}`) - 0.5) * 12) * (Math.PI / 180);
        const L = length * (0.55 + 0.6 * random(`${seed}-l${i}`)) * grow;
        const w = 26 + 14 * random(`${seed}-w${i}`);
        const tip = {x: origin.x + Math.cos(a) * L, y: origin.y + Math.sin(a) * L};
        const nx = -Math.sin(a) * (w / 2);
        const ny = Math.cos(a) * (w / 2);
        const col = colors[i % colors.length];
        // gota que se separa de la punta y cae
        const v = 900 + 500 * random(`${seed}-v${i}`);
        const gx = tip.x + Math.cos(a) * v * Math.max(0, tau - 0.12) * 0.6;
        const gy = tip.y + Math.sin(a) * v * Math.max(0, tau - 0.12) * 0.6 + 0.5 * 2400 * Math.max(0, tau - 0.12) ** 2;
        return (
          <g key={i}>
            <path
              d={`M${origin.x + nx},${origin.y + ny} L${tip.x},${tip.y} L${origin.x - nx},${origin.y - ny} Z`}
              fill={col}
              opacity={fade}
            />
            <circle cx={tau > 0.12 ? gx : tip.x} cy={tau > 0.12 ? gy : tip.y} r={w * 0.62} fill={col} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------- revelaciones ----------
/** Revela `children` con un círculo que nace en `origin` (círculo desde un objeto). */
export const CircleReveal: React.FC<{at: number; origin: Pt; dur?: number; children: React.ReactNode}> = ({at, origin, dur = 0.22, children}) => {
  const {t} = useTime();
  if (t < at) return null;
  const far = Math.max(...[{x: 0, y: 0}, {x: 1080, y: 0}, {x: 0, y: 1920}, {x: 1080, y: 1920}].map((p) => Math.hypot(p.x - origin.x, p.y - origin.y)));
  const r = interpolate(t, [at, at + dur], [0, far + 20], {...clamp, easing: Easing.out(Easing.cubic)});
  const done = t >= at + dur;
  return <AbsoluteFill style={{clipPath: done ? undefined : `circle(${r}px at ${origin.x}px ${origin.y}px)`}}>{children}</AbsoluteFill>;
};

/** Revela `children` con una mancha orgánica con contorno que crece desde `origin`. */
export const BlobReveal: React.FC<{
  at: number;
  origin: Pt;
  dur?: number;
  outline?: string;
  outlineWidth?: number;
  seed?: string;
  children: React.ReactNode;
}> = ({at, origin, dur = 0.2, outline = BG.violeta, outlineWidth = 7, seed = "blob", children}) => {
  const {t} = useTime();
  if (t < at) return null;
  const done = t >= at + dur + 0.03;
  if (done) return <AbsoluteFill>{children}</AbsoluteFill>;
  const far = Math.max(...[{x: 0, y: 0}, {x: 1080, y: 0}, {x: 0, y: 1920}, {x: 1080, y: 1920}].map((p) => Math.hypot(p.x - origin.x, p.y - origin.y)));
  const R = interpolate(t, [at, at + dur], [0, far * 1.25], {...clamp, easing: Easing.out(Easing.cubic)});
  const n = 18;
  const ph = [0, 1, 2].map((k) => random(`${seed}-p${k}`) * Math.PI * 2);
  const pts: Pt[] = Array.from({length: n}, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    const wob = 1 + 0.12 * Math.sin(3 * a + ph[0] + t * 9) + 0.08 * Math.sin(5 * a + ph[1]) + 0.05 * Math.sin(7 * a + ph[2] - t * 6);
    return {x: origin.x + Math.cos(a) * R * wob, y: origin.y + Math.sin(a) * R * wob};
  });
  const clip = `polygon(${pts.map((p) => `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`).join(", ")})`;
  return (
    <>
      <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        <polygon points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={outline} strokeWidth={outlineWidth} strokeLinejoin="round" />
      </svg>
    </>
  );
};
