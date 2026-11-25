// Pista de SFX: convierte eventos {type, at} en audios colocados al frame, alineados por la ancla de cada sonido.
// La biblioteca (rutas, volumen, ataque y pico medidos) sale de public/sfx/sfx.manifest.json vía scripts/sfx-gen.mjs.
import React, {useMemo} from "react";
import {interpolate, Sequence, staticFile, useVideoConfig} from "remotion";
import {Audio} from "@remotion/media";
import {SFX_LIBRARY, type SfxName} from "./sfx-library.gen";

export type {SfxName} from "./sfx-library.gen";

export type SfxEvent = {
  /** Nombre del sonido en la biblioteca. */
  type: SfxName;
  /**
   * Segundo del evento visual. Según la ancla del sonido, en ese instante cae:
   * `inicio` → el ataque percibido (pop, clic, tick, golpe…),
   * `pico` → el punto más fuerte (swipe, whoosh: el frame del corte o la llegada),
   * `fin` → el final del sonido (riser: el instante en que empieza la pausa).
   */
  at: number;
  /** Variante fija (1 = primera viva). Sin esto, las variantes rotan por orden de aparición. */
  v?: number;
  /** Multiplica el volumen de la biblioteca (1 = tal cual). */
  gain?: number;
  /** Corta el sonido en este segundo, con un fade de 4 f (tecleo, conteo). */
  until?: number;
};

type Placed = {key: string; src: string; from: number; trim: number; frames: number; volume: number; fadeAt: number | null; hit: number; type: SfxName};

/** Distancia mínima entre dos SFX (s). La regla de la skill: un SFX por evento, nunca dos a la vez. */
const MIN_GAP = 0.12;

export const SfxTrack: React.FC<{events: SfxEvent[]; gain?: number}> = ({events, gain = 1}) => {
  const {fps} = useVideoConfig();

  const placed = useMemo(() => {
    const count: Partial<Record<SfxName, number>> = {};
    const out: Placed[] = [];
    [...events].sort((a, b) => a.at - b.at).forEach((e, i) => {
      const def = SFX_LIBRARY[e.type];
      if (!def || !def.archivos.length) {
        console.warn(`[SfxTrack] "${e.type}" no tiene archivos generados. Corre: node scripts/sfx-gen.mjs ${e.type}`);
        return;
      }
      const n = count[e.type] ?? 0;
      count[e.type] = n + 1;
      const file = def.archivos[((e.v ?? n + 1) - 1) % def.archivos.length];
      const offsetMs = def.ancla === "pico" ? file.picoMs : def.ancla === "fin" ? file.duracionMs : file.ataqueMs;
      const start = e.at - offsetMs / 1000;
      const startFrame = Math.round(start * fps);
      const trim = Math.max(0, -startFrame); // si el sonido empezaría antes del frame 0, se recorta su comienzo
      const naturalFrames = Math.ceil((file.duracionMs / 1000) * fps) + 1;
      const untilFrames = e.until !== undefined ? Math.round((e.until - start) * fps) : null;
      const frames = Math.max(1, Math.min(naturalFrames, untilFrames ?? naturalFrames) - trim);
      out.push({
        key: `${i}-${e.type}`,
        src: file.src,
        from: Math.max(0, startFrame),
        trim,
        frames,
        volume: def.volumen * (e.gain ?? 1),
        fadeAt: untilFrames !== null && untilFrames < naturalFrames ? frames - 4 : null,
        hit: e.at,
        type: e.type,
      });
    });
    for (let i = 1; i < out.length; i++) {
      if (out[i].hit - out[i - 1].hit < MIN_GAP) {
        console.warn(`[SfxTrack] ${out[i - 1].type} (${out[i - 1].hit.toFixed(2)} s) y ${out[i].type} (${out[i].hit.toFixed(2)} s) están a menos de ${MIN_GAP * 1000} ms`);
      }
    }
    return out;
  }, [events, fps]);

  return (
    <>
      {placed.map((p) => (
        <Sequence key={p.key} from={p.from} durationInFrames={p.frames} layout="none" name={`sfx ${p.type}`}>
          <Audio
            src={staticFile(p.src)}
            trimBefore={p.trim || undefined}
            volume={(f) =>
              p.volume * gain * (p.fadeAt === null ? 1 : interpolate(f, [p.fadeAt, p.fadeAt + 4], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}))
            }
          />
        </Sequence>
      ))}
    </>
  );
};
