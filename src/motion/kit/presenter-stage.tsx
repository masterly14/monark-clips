// Presentador integrado (SKILL.md "Planos con presentador", devices.md D2–D4).
// Un solo video que nunca se desmonta: cambia de forma (cámara completa, ventana, dividida)
// con un morph de spring, así la voz y el gesto siguen continuos entre planos.
// Nunca se muestra en un círculo pequeño: cuando la gráfica necesita el cuadro, el presentador
// sale de cuadro (`hidden`: su marco se desliza hacia abajo como un objeto) y la voz sigue.
import React from "react";
import {interpolate, spring, staticFile} from "remotion";
import {Video} from "@remotion/media";
import {useTime} from "./time";
import {UI} from "./tokens";

export type StageShot =
  | {mode: "full"; zoom?: number}
  | {mode: "window"; x: number; y: number; w: number; h: number; rotate?: number}
  | {mode: "split"; ratio?: number}
  | {mode: "hidden"};

/** En `at` el presentador empieza a transformarse hacia `shot` (morph de ≈ `dur` s). */
export type StageKey = {at: number; shot: StageShot; dur?: number};

type Spec = {
  x: number; y: number; w: number; h: number;
  radius: number; rotate: number;
  scale: number; // px de pantalla por px del video fuente
  fx: number; fy: number; // dónde debe quedar el rostro en pantalla
  border: number; // borde blanco (ventana / dividida)
  ring: number; // anillo de color (burbuja)
  opacity: number;
};

const specFor = (shot: StageShot, prev: Spec | null, src: {w: number; h: number}, faceSize: number, t: number, at: number, punch = 1): Spec => {
  const cover = (w: number, h: number) => Math.max(w / src.w, h / src.h);
  switch (shot.mode) {
    case "full": {
      const zoom = (shot.zoom ?? 1) * punch * (1 + 0.05 * Math.min(1, Math.max(0, t - at) / 6)); // zoom lento 1 → 1,05 (+ punch-in en jump cuts)
      const s = cover(1080, 1920) * zoom;
      return {x: 0, y: 0, w: 1080, h: 1920, radius: 0, rotate: 0, scale: s, fx: 540, fy: 960, border: 0, ring: 0, opacity: 1};
    }
    case "window": {
      const s = cover(shot.w, shot.h) * 1.12;
      return {x: shot.x, y: shot.y, w: shot.w, h: shot.h, radius: 44, rotate: shot.rotate ?? 0, scale: s, fx: shot.x + shot.w / 2, fy: shot.y + shot.h * 0.42, border: 6, ring: 0, opacity: 1};
    }
    case "split": {
      const top = 1920 * (shot.ratio ?? 0.55);
      const w = 1032;
      const h = 1920 - top + 80; // sobresale por abajo: solo se ven las esquinas superiores
      const s = cover(w, h) * 1.04 * punch;
      return {x: 24, y: top, w, h, radius: 44, rotate: 0, scale: s, fx: 540, fy: top + (1920 - top) * 0.46, border: 0, ring: 0, opacity: 1};
    }
    case "hidden": {
      // sale de cuadro como un objeto: el marco conserva su tamaño, se redondea, gira un poco y baja
      const p = prev ?? specFor({mode: "full"}, null, src, faceSize, t, at, punch);
      return {...p, y: 1920 + 120, fy: p.fy + (1920 + 120 - p.y), rotate: 5, radius: 44, border: 0, ring: 0};
    }
  }
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const mix = (a: Spec, b: Spec, p: number): Spec => {
  const o = {} as Spec;
  (Object.keys(a) as (keyof Spec)[]).forEach((k) => (o[k] = lerp(a[k], b[k], p)));
  return o;
};

export const PresenterStage: React.FC<{
  src: string;
  keys: StageKey[];
  /** centro del rostro en el video fuente (px) */
  face: {x: number; y: number};
  /** ancho aproximado del rostro en el video fuente (px) */
  faceSize?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  muted?: boolean;
  trimBefore?: number;
  /** velo superior en cámara completa para leer el titular */
  veil?: boolean;
  /** tiempos de jump cut del video (pausas recortadas): en `full` y `split` alterna un punch-in de 7 % para disimular el salto */
  jumpCuts?: number[];
}> = ({src, keys, face, faceSize = 380, sourceWidth = 1080, sourceHeight = 1920, muted = true, trimBefore, veil = true, jumpCuts = []}) => {
  const {t, fps} = useTime();
  const sorted = [...keys].sort((a, b) => a.at - b.at);
  const source = {w: sourceWidth, h: sourceHeight};
  const punch = jumpCuts.filter((c) => t >= c).length % 2 === 1 ? 1.07 : 1;

  // recorre los keys acumulando el estado, igual que una cámara
  let spec: Spec | null = null;
  for (const k of sorted) {
    if (t < k.at) break;
    const target = specFor(k.shot, spec, source, faceSize, t, k.at, punch);
    const p: number = spec ? spring({frame: (t - k.at) * fps, fps, config: {damping: 16, stiffness: 160, mass: 1}, durationInFrames: Math.round((k.dur ?? 0.5) * fps)}) : 1;
    spec = spec ? mix(spec, target, p) : target;
  }
  // si está oculto, el mismo <Video> sigue montado (invisible) para que audio y reproducción no se reinicien
  const hidden = !spec || spec.opacity <= 0.01 || spec.w < 2 || spec.y >= 1920;
  if (hidden) spec = {x: 0, y: 0, w: 2, h: 2, radius: 0, rotate: 0, scale: 2 / source.w, fx: 1, fy: 1, border: 0, ring: 0, opacity: 0};

  const s = spec as Spec;
  const VW = source.w * s.scale;
  const VH = source.h * s.scale;
  // coloca el rostro en (fx, fy) y limita para que el video siempre cubra el marco
  let left = s.fx - face.x * s.scale;
  let top = s.fy - face.y * s.scale;
  left = Math.min(s.x, Math.max(s.x + s.w - VW, left));
  top = Math.min(s.y, Math.max(s.y + s.h - VH, top));

  const fullness = (s.w * s.h) / (1080 * 1920);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: s.x,
          top: s.y,
          width: s.w,
          height: s.h,
          borderRadius: s.radius,
          overflow: "hidden",
          opacity: s.opacity,
          transform: `rotate(${s.rotate}deg)`,
          boxShadow: fullness < 0.97 ? "0 40px 80px -30px rgba(0,0,0,0.45)" : undefined,
          background: "#000",
        }}
      >
        <div style={{position: "absolute", left: left - s.x, top: top - s.y, width: VW, height: VH}}>
          <Video src={staticFile(src)} muted={muted} trimBefore={trimBefore} style={{width: "100%", height: "100%"}} objectFit="fill" />
        </div>
        {veil && fullness > 0.8 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 26%, rgba(0,0,0,0) 46%)",
              opacity: interpolate(fullness, [0.8, 1], [0, 1]),
            }}
          />
        ) : null}
        {s.border > 0.5 ? <div style={{position: "absolute", inset: 0, borderRadius: s.radius, border: `${s.border}px solid #fff`}} /> : null}
      </div>
    </>
  );
};
