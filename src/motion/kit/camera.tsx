// Cámara del escenario (devices.md A18): todo el diorama vive en un contenedor y
// la "cámara" se mueve dentro de él. Los elementos no se animan por separado
// para entrar o salir: los acerca, aleja o revela la cámara.
import React, {createContext, useContext} from "react";
import {Easing, interpolate} from "remotion";
import {useTime} from "./time";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/**
 * Una posición de cámara. `focus` es el punto del mundo (en px del lienzo 1080×1920)
 * que queda en el centro de la pantalla; `zoom` 1 = plano general.
 * La cámara llega a esta posición en `dur` segundos a partir de `at`.
 */
export type CamKey = {
  at: number;
  zoom?: number;
  focus?: {x: number; y: number};
  rotate?: number;
  /** brillo de la escena (time-lapse día/noche): 1 = normal */
  light?: number;
  dur?: number;
  ease?: "out" | "inOut" | "punch" | "cut";
};

type CamState = {zoom: number; fx: number; fy: number; rotate: number; light: number};

const CENTER = {x: 540, y: 960};
const BASE: CamState = {zoom: 1, fx: CENTER.x, fy: CENTER.y, rotate: 0, light: 1};

const EASE = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  // llega con un 2 % de sobrepaso y asienta (dolly-in / pull-back con peso)
  punch: Easing.bezier(0.2, 0.9, 0.25, 1.06),
  cut: (x: number) => (x > 0 ? 1 : 0),
};

const resolve = (key: CamKey, prev: CamState): CamState => ({
  zoom: key.zoom ?? prev.zoom,
  fx: key.focus?.x ?? prev.fx,
  fy: key.focus?.y ?? prev.fy,
  rotate: key.rotate ?? prev.rotate,
  light: key.light ?? prev.light,
});

/** Estado de la cámara en el segundo `t` (útil para sincronizar otras capas con ella). */
export const cameraAt = (keys: CamKey[], t: number): CamState => {
  const sorted = [...keys].sort((a, b) => a.at - b.at);
  let state = BASE;
  for (const [i, k] of sorted.entries()) {
    if (t < k.at && i > 0) break;
    const target = resolve(k, state);
    // el primer key es el encuadre inicial: se aplica sin transición
    const dur = i === 0 || k.ease === "cut" ? 0 : (k.dur ?? 0.25);
    const p = dur === 0 ? 1 : interpolate(t, [k.at, k.at + dur], [0, 1], {...clamp, easing: EASE[k.ease ?? "punch"]});
    // el zoom se interpola en escala logarítmica para que acercar y alejar se sientan iguales
    const zoom = Math.exp(Math.log(state.zoom) + (Math.log(target.zoom) - Math.log(state.zoom)) * p);
    state = {
      zoom,
      fx: state.fx + (target.fx - state.fx) * p,
      fy: state.fy + (target.fy - state.fy) * p,
      rotate: state.rotate + (target.rotate - state.rotate) * p,
      light: state.light + (target.light - state.light) * p,
    };
  }
  return state;
};

const CameraContext = createContext<CamState>(BASE);
/** Dentro de un WorldCamera: estado actual de la cámara (p. ej. para contra-escalar un trazo). */
export const useCamera = () => useContext(CameraContext);

/**
 * Contenedor del diorama. Coloca los hijos en coordenadas del mundo (mismo sistema que el lienzo
 * cuando zoom = 1 y focus = centro). Para una "revelación de mundo", empieza con un key cerrado
 * (zoom 2–3 sobre el personaje) y suelta a zoom 1: el plano cerrado resulta ser parte del mundo.
 */
export const WorldCamera: React.FC<{
  keys: CamKey[];
  children: React.ReactNode;
  /** desenfoque de movimiento proporcional a la velocidad del zoom (0 = apagado) */
  motionBlur?: number;
  screen?: {x: number; y: number};
}> = ({keys, children, motionBlur = 4, screen = CENTER}) => {
  const {t, fps} = useTime();
  const c = cameraAt(keys, t);
  const before = cameraAt(keys, Math.max(0, t - 1 / fps));
  const speed = Math.abs(Math.log(c.zoom) - Math.log(before.zoom)) * fps; // unidades log/s
  const blur = Math.min(motionBlur, speed * 1.4);
  const transform = `translate(${screen.x}px, ${screen.y}px) rotate(${c.rotate}deg) scale(${c.zoom}) translate(${-c.fx}px, ${-c.fy}px)`;
  return (
    <CameraContext.Provider value={c}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform,
          filter: `${blur > 0.3 ? `blur(${blur.toFixed(2)}px) ` : ""}brightness(${c.light})`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </CameraContext.Provider>
  );
};
