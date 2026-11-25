// Audición de la biblioteca de SFX en contexto: una secuencia típica Problema → Giro → Demo → Cierre.
// Cada evento se muestra en pantalla en el instante en que debe caer su golpe. No es una pieza para publicar.
import React from "react";
import {AbsoluteFill, interpolate} from "remotion";
import {BG, fonts, SfxTrack, useTime, type SfxEvent} from "../kit";

export const FPS = 30;
export const DURATION_S = 14;

const EVENTS: (SfxEvent & {label: string; bg: keyof typeof BG})[] = [
  // Problema: lento, espaciado
  {type: "notificacion", at: 0.4, label: "notificación · llega un mensaje", bg: "tinta"},
  {type: "notificacion", at: 1.1, label: "notificación · otro más", bg: "tinta"},
  {type: "alerta", at: 1.9, label: "alerta · reserva cruzada", bg: "tinta"},
  {type: "glitch", at: 2.7, label: "glitch · la UI falla", bg: "tinta"},
  {type: "whoosh", at: 3.4, label: "whoosh · pull-back del mundo", bg: "tinta"},
  // Giro: riser → pausa → impacto
  {type: "riser", at: 4.75, label: "riser · termina y empieza la pausa", bg: "tinta"},
  {type: "impacto", at: 5.0, label: "impacto · la marca rompe el mundo", bg: "crema"},
  // Demo: un swipe por verbo, UI con pop/clic/tecleo/confirmación
  {type: "swipe", at: 6.2, label: "swipe · corte de fondo (verbo 1)", bg: "crema"},
  {type: "pop", at: 6.35, label: "pop · entra la tarjeta", bg: "crema"},
  {type: "tecleo", at: 6.7, until: 7.4, label: "tecleo · se escribe el campo", bg: "crema"},
  {type: "clic", at: 7.55, label: "clic · botón", bg: "crema"},
  {type: "confirmacion", at: 7.8, label: "confirmación · ✓ listo", bg: "crema"},
  {type: "swipe", at: 8.5, label: "swipe · corte de fondo (verbo 2)", bg: "crema"},
  {type: "tick", at: 8.75, label: "tick · casilla 1", bg: "crema"},
  {type: "tick", at: 8.95, label: "tick · casilla 2", bg: "crema"},
  {type: "tick", at: 9.15, label: "tick · casilla 3", bg: "crema"},
  {type: "swipe", at: 9.8, label: "swipe · corte de fondo (verbo 3)", bg: "crema"},
  {type: "conteo", at: 9.95, until: 10.7, label: "conteo · la cifra rueda", bg: "crema"},
  {type: "golpe", at: 10.8, label: "golpe · sello «Resuelto»", bg: "crema"},
  {type: "destello", at: 10.92, label: "destello · checks en cascada", bg: "crema"},
  // Cierre
  {type: "logo", at: 11.9, label: "logo · tarjeta final", bg: "tinta"},
  {type: "clic", at: 12.9, label: "clic · CTA", bg: "tinta"},
];

export const SfxDemo: React.FC = () => {
  const {t} = useTime();
  const current = [...EVENTS].reverse().find((e) => t >= e.at) ?? EVENTS[0];
  const since = t - current.at;
  const pulse = since >= 0 ? interpolate(since, [0, 0.25], [1.08, 1], {extrapolateRight: "clamp"}) : 1;
  const dark = current.bg === "tinta";
  return (
    <AbsoluteFill style={{background: BG[current.bg], alignItems: "center", justifyContent: "center", padding: 80}}>
      <SfxTrack events={EVENTS} />
      <div style={{fontFamily: fonts.mono, fontSize: 34, color: dark ? "#9A968F" : "#6B665E", marginBottom: 28}}>{t.toFixed(2)} s</div>
      <div style={{fontFamily: fonts.sans, fontSize: 76, fontWeight: 700, color: dark ? "#F4EFE6" : "#16130F", textAlign: "center", transform: `scale(${pulse})`}}>
        {current.label}
      </div>
    </AbsoluteFill>
  );
};
